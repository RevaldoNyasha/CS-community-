import { router } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { InitialsAvatar } from '@/components/initials-avatar';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { ChatUser } from '@/types';

type Props = {
    recipient: ChatUser;
    /** The post the request is about, if any. */
    about?: { id: number; title: string };
    children: ReactNode;
};

// "Message author" flow: write a short request about a post. Sending it opens the chat.
export function MessageRequestDialog({ recipient, about, children }: Props) {
    const firstName = recipient.name.split(' ')[0];
    const defaultMessage = about
        ? `Hi ${firstName}, I saw your post "${about.title}" and would like to ask you about it.`
        : `Hi ${firstName}, I'd like to chat with you.`;

    const [open, setOpen] = useState(false);
    const [body, setBody] = useState(defaultMessage);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) {
            setBody(defaultMessage);
            setError(null);
        }
    };

    const send = () => {
        if (!body.trim()) return;

        router.post(
            '/messages/requests',
            {
                recipient_id: recipient.id,
                body: body.trim(),
                post_id: about?.id ?? null,
            },
            {
                onStart: () => setSending(true),
                onFinish: () => setSending(false),
                onError: (errors) =>
                    setError(
                        errors.body ??
                            errors.recipient_id ??
                            'Could not send your message. Please try again.',
                    ),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="gap-0 rounded-xl p-0 sm:max-w-md">
                <div className="flex items-center gap-3 border-b border-border p-5">
                    <InitialsAvatar name={recipient.name} />
                    <div className="min-w-0">
                        <DialogTitle className="text-base">
                            Message {recipient.name}
                        </DialogTitle>
                        <DialogDescription className="truncate text-xs">
                            {about
                                ? `About: ${about.title}`
                                : 'Send a private message request'}
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-5">
                    <label
                        htmlFor="message-request-body"
                        className="text-sm font-medium"
                    >
                        Your message
                    </label>
                    <textarea
                        id="message-request-body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    />
                    <InputError message={error ?? undefined} />
                    <p className="mt-2 text-xs text-muted-foreground">
                        {firstName} will see this as a message request and can
                        accept or decline it.
                    </p>
                    <button
                        type="button"
                        onClick={send}
                        disabled={!body.trim() || sending}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        {sending ? <Spinner /> : <Send className="size-4" />}
                        Send request
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
