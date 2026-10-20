import { Head, router, usePage } from '@inertiajs/react';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import { useRef, useState } from 'react';
import {
    ListingEmpty,
    ListingFooter,
    ListingHeader,
    ListingPagination,
    tileGridClass,
} from '@/components/listing';
import { PostTile } from '@/components/post-tile';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Post, SharedData } from '@/types';

type Filters = { search: string; date_from: string; date_to: string };
type Props = { posts: PaginatedData<Post>; filters: Filters };

export default function ProjectsIndex({ posts, filters }: Props) {
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
                    '/projects',
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
            <Head title="Projects" />

            <div className="mx-auto max-w-7xl">
                <ListingHeader
                    title="Projects"
                    search={search}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search projects"
                    addLabel="Add project"
                    guestMessage="Please login to share a project."
                />

                {posts.data.length === 0 ? (
                    <ListingEmpty
                        icon={FolderGit2}
                        title={
                            search.trim()
                                ? 'No matching projects'
                                : 'No projects yet'
                        }
                        message={
                            search.trim()
                                ? 'Try a different search.'
                                : 'Be the first to share something you built.'
                        }
                    />
                ) : (
                    <div className={tileGridClass}>
                        {posts.data.map((post) => (
                            <PostTile
                                key={post.id}
                                post={post}
                                viewerId={auth.user?.id}
                                now={now}
                                footer={
                                    post.github_url && (
                                        <a
                                            href={post.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                                        >
                                            <ExternalLink className="size-3.5" />
                                            View code
                                        </a>
                                    )
                                }
                            />
                        ))}
                    </div>
                )}

                <ListingPagination data={posts} />
                <ListingFooter />
            </div>
        </AppLayout>
    );
}
