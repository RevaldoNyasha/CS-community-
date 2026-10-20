import { Head, router, usePage } from '@inertiajs/react';
import { CalendarDays, History, Trophy } from 'lucide-react';
import { useRef, useState } from 'react';
import {
    ListingEmpty,
    ListingFooter,
    ListingHeader,
    SectionHeading,
    tileGridClass,
} from '@/components/listing';
import { PostTile, TileBadge } from '@/components/post-tile';
import AppLayout from '@/layouts/app-layout';
import type { Post, SharedData } from '@/types';

type Filters = { search: string; date_from: string; date_to: string };
type Props = { upcoming: Post[]; finished: Post[]; filters: Filters };

function eventDate(post: Post) {
    return post.event_date
        ? new Date(post.event_date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : null;
}

export default function HackathonsIndex({
    upcoming,
    finished,
    filters,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [now] = useState(() => Date.now());
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(
            () =>
                router.get(
                    '/hackathons',
                    { search: value.trim() || undefined },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                ),
            350,
        );
    };

    return (
        <AppLayout>
            <Head title="Hackathons" />

            <div className="mx-auto max-w-7xl">
                <ListingHeader
                    title="Hackathons"
                    search={search}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search hackathons"
                    addLabel="Add hackathon"
                    guestMessage="Please login to share a hackathon."
                />

                <section className="mb-12">
                    <SectionHeading title="Upcoming" />
                    {upcoming.length === 0 ? (
                        <ListingEmpty
                            icon={Trophy}
                            title="No upcoming hackathons"
                            message="New events will show up here. Stay tuned."
                        />
                    ) : (
                        <div className={tileGridClass}>
                            {upcoming.map((post) => {
                                const date = eventDate(post);

                                return (
                                    <PostTile
                                        key={post.id}
                                        post={post}
                                        viewerId={auth.user?.id}
                                        now={now}
                                        badges={
                                            date && (
                                                <TileBadge className="bg-primary/90">
                                                    <CalendarDays className="size-3" />
                                                    {date}
                                                </TileBadge>
                                            )
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </section>

                <section>
                    <SectionHeading title="Past events" />
                    {finished.length === 0 ? (
                        <ListingEmpty
                            icon={History}
                            title="No past events yet"
                            message="Finished hackathons and their winners are archived here."
                        />
                    ) : (
                        <div className={tileGridClass}>
                            {finished.map((post) => {
                                const date = eventDate(post);

                                return (
                                    <PostTile
                                        key={post.id}
                                        post={post}
                                        viewerId={auth.user?.id}
                                        now={now}
                                        dimmed
                                        badges={
                                            <TileBadge>
                                                Ended{date && ` · ${date}`}
                                            </TileBadge>
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </section>

                <ListingFooter />
            </div>
        </AppLayout>
    );
}
