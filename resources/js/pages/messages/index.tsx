import { Head, Link, router, usePoll } from '@inertiajs/react';
import { ArrowLeft, MessageCircle, Search, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { InitialsAvatar } from '@/components/initials-avatar';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { timeAgo } from '@/lib/time-ago';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { ConversationDetail, ConversationSummary } from '@/types';

type Props = {
    conversations: ConversationSummary[];
    active: ConversationDetail | null;
};

type Tab = 'chats' | 'requests';

// Re-fetch the inbox and open chat every few seconds so new messages show up.
const POLL_MS = 10_000;

function ConversationList({
    conversations,
    selectedId,
}: {
    conversations: ConversationSummary[];
    selectedId: number | null;
}) {
    const [tab, setTab] = useState<Tab>('chats');
    const [query, setQuery] = useState('');

    const requests = conversations.filter((c) => c.status === 'incoming');
    const visible = (tab === 'requests' ? requests : conversations).filter(
        (c) => c.with.name.toLowerCase().includes(query.trim().toLowerCase()),
    );

    return (
        <div>
            <h1 className="px-2 pt-1 pb-3 text-2xl font-bold">Chats</h1>

            <div className="relative mx-2 mb-3">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search chats"
                    className="w-full rounded-full border-0 bg-secondary py-2.5 pr-4 pl-10 text-[15px] placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
            </div>

            <div className="mx-2 mb-3 flex gap-2">
                {(['chats', 'requests'] as const).map((value) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setTab(value)}
                        aria-pressed={tab === value}
                        className={cn(
                            'rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
                            tab === value
                                ? 'bg-primary/15 text-primary'
                                : 'text-muted-foreground hover:bg-secondary',
                        )}
                    >
                        {value === 'chats' ? 'Chats' : 'Requests'}
                        {value === 'requests' && requests.length > 0 && (
                            <span className="ml-1.5">({requests.length})</span>
                        )}
                    </button>
                ))}
            </div>

            {visible.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                    {tab === 'requests'
                        ? 'No message requests.'
                        : query
                          ? 'No chats match your search.'
                          : 'No chats yet.'}
                </p>
            ) : (
                <ul className="space-y-0.5">
                    {visible.map((c) => (
                        <li key={c.id}>
                            <Link
                                href={`/messages?c=${c.id}`}
                                preserveState
                                preserveScroll
                                className={cn(
                                    'flex items-center gap-3 rounded-lg p-2 transition-colors',
                                    c.id === selectedId
                                        ? 'bg-primary/10'
                                        : 'hover:bg-secondary/60',
                                )}
                            >
                                <InitialsAvatar
                                    name={c.with.name}
                                    className="size-14 text-base"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[15px] font-medium">
                                        {c.with.name}
                                    </p>
                                    <p
                                        className={cn(
                                            'truncate text-[13px]',
                                            c.unread
                                                ? 'font-semibold text-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {c.status === 'incoming'
                                            ? 'Wants to message you · '
                                            : c.status === 'outgoing'
                                              ? 'Request sent · '
                                              : c.lastMessage?.fromMe
                                                ? 'You: '
                                                : ''}
                                        {c.lastMessage?.body}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {timeAgo(c.updatedAt)}
                                    </p>
                                </div>
                                {c.unread && (
                                    <span className="size-3 shrink-0 rounded-full bg-primary" />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Thread({ conversation }: { conversation: ConversationDetail }) {
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);
    const firstName = conversation.with.name.split(' ')[0];
    const canReply = conversation.status !== 'incoming';

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: 'end' });
    }, [conversation.messages.length, conversation.id]);

    const post = (url: string, data: Record<string, string> = {}) =>
        router.post(url, data, {
            preserveScroll: true,
            onStart: () => setBusy(true),
            onFinish: () => setBusy(false),
            onSuccess: () => setDraft(''),
        });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!draft.trim() || !canReply || busy) return;
        post(`/conversations/${conversation.id}/messages`, {
            body: draft.trim(),
        });
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
                <Link
                    href="/messages"
                    className="-ml-1 rounded-full p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
                >
                    <span className="sr-only">Back to chats</span>
                    <ArrowLeft className="size-5" />
                </Link>
                <InitialsAvatar name={conversation.with.name} />
                <div className="min-w-0">
                    <p className="truncate font-semibold">
                        {conversation.with.name}
                    </p>
                    {conversation.about && (
                        <p className="truncate text-xs text-muted-foreground">
                            About:{' '}
                            <Link
                                href={`/posts/${conversation.about.slug}`}
                                className="text-primary hover:underline"
                            >
                                {conversation.about.title}
                            </Link>
                        </p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
                <div className="mb-6 flex flex-col items-center text-center">
                    <InitialsAvatar
                        name={conversation.with.name}
                        className="size-20 text-xl"
                    />
                    <p className="mt-3 text-lg font-semibold">
                        {conversation.with.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        DEV-CRAFT member
                    </p>
                </div>

                {conversation.messages.map((m) => (
                    <div
                        key={m.id}
                        className={cn(
                            'flex',
                            m.fromMe ? 'justify-end' : 'justify-start',
                        )}
                    >
                        <p
                            title={new Date(m.sentAt).toLocaleString()}
                            className={cn(
                                'max-w-[75%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap',
                                m.fromMe
                                    ? 'rounded-br-md bg-primary text-primary-foreground'
                                    : 'rounded-bl-md bg-secondary text-foreground',
                            )}
                        >
                            {m.body}
                        </p>
                    </div>
                ))}

                {conversation.status === 'outgoing' && (
                    <p className="pt-2 text-center text-xs text-muted-foreground">
                        Message request sent. {firstName} can accept it to start
                        chatting.
                    </p>
                )}
                <div ref={endRef} />
            </div>

            {/* Request actions or composer */}
            {conversation.status === 'incoming' ? (
                <div className="border-t border-border bg-card p-4 text-center">
                    <p className="text-sm">
                        <span className="font-semibold">
                            {conversation.with.name}
                        </span>{' '}
                        wants to send you a message.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Accept to reply. If you decline, they won't be told.
                    </p>
                    <div className="mt-4 flex justify-center gap-3">
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                                post(
                                    `/conversations/${conversation.id}/decline`,
                                )
                            }
                            className="rounded-lg bg-secondary px-5 py-2 text-sm font-semibold transition-colors hover:bg-secondary/70 disabled:opacity-50"
                        >
                            Decline
                        </button>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                                post(`/conversations/${conversation.id}/accept`)
                            }
                            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={submit}
                    className="flex items-center gap-2 border-t border-border bg-card p-3"
                >
                    <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        maxLength={1000}
                        placeholder="Aa"
                        aria-label={`Message ${conversation.with.name}`}
                        className="flex-1 rounded-full border-0 bg-secondary px-4 py-2.5 text-[15px] placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!draft.trim() || busy}
                        className="flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary disabled:opacity-40"
                    >
                        <span className="sr-only">Send</span>
                        {busy ? (
                            <Spinner />
                        ) : (
                            <SendHorizontal className="size-5" />
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

function EmptyPane({ hasChats }: { hasChats: boolean }) {
    return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <MessageCircle
                className="size-20 text-muted-foreground/40"
                strokeWidth={1}
            />
            <p className="mt-5 text-lg font-semibold">
                {hasChats ? 'Select a chat' : 'Your messages'}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {hasChats
                    ? 'Choose a conversation from the list to start chatting.'
                    : 'Use the message button on a post to ask its author about a resource privately.'}
            </p>
            {!hasChats && (
                <Link
                    href={dashboard()}
                    className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Browse posts
                </Link>
            )}
        </div>
    );
}

export default function Messages({ conversations, active }: Props) {
    usePoll(POLL_MS, {
        only: ['conversations', 'active', 'unreadMessages'],
    });

    const list = (
        <ConversationList
            conversations={conversations}
            selectedId={active?.id ?? null}
        />
    );

    return (
        <AppLayout sidebar={list} mainClassName="p-0 sm:p-0">
            <Head title="Messages" />

            <div className="h-[calc(100svh-3.5rem)]">
                {active ? (
                    <Thread conversation={active} />
                ) : (
                    <>
                        {/* On small screens the list is the main view until a chat is picked */}
                        <div className="h-full overflow-y-auto p-3 lg:hidden">
                            {list}
                        </div>
                        <div className="hidden h-full lg:block">
                            <EmptyPane hasChats={conversations.length > 0} />
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
