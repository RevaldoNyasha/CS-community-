import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, FileText } from 'lucide-react';
import { useRef, useState } from 'react';
import {
    FilterChip,
    ListingEmpty,
    ListingFooter,
    ListingHeader,
    ListingPagination,
    tileGridClass,
} from '@/components/listing';
import { PostTile, TileBadge } from '@/components/post-tile';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Post, SharedData } from '@/types';

type Filters = {
    search: string;
    date_from: string;
    date_to: string;
    has_pdf: boolean;
};
type Props = { posts: PaginatedData<Post>; filters: Filters };

export default function ResourcesIndex({ posts, filters }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [hasPdf, setHasPdf] = useState(filters.has_pdf ?? false);
    const [now] = useState(() => Date.now());
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const visit = (next: { search: string; hasPdf: boolean }) =>
        router.get(
            '/resources',
            {
                search: next.search.trim() || undefined,
                has_pdf: next.hasPdf ? '1' : undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );

    const handleSearch = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(
            () => visit({ search: value, hasPdf }),
            350,
        );
    };

    const togglePdf = () => {
        setHasPdf(!hasPdf);
        visit({ search, hasPdf: !hasPdf });
    };

    const isFiltered = !!(search.trim() || hasPdf);

    return (
        <AppLayout>
            <Head title="Resources" />

            <div className="mx-auto max-w-7xl">
                <ListingHeader
                    title="Resources"
                    search={search}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search resources"
                    addLabel="Add resource"
                    guestMessage="Please login to share a resource."
                    filters={
                        <FilterChip
                            active={hasPdf}
                            onClick={togglePdf}
                            icon={FileText}
                        >
                            PDF only
                        </FilterChip>
                    }
                />

                {posts.data.length === 0 ? (
                    <ListingEmpty
                        icon={BookOpen}
                        title={
                            isFiltered
                                ? 'No matching resources'
                                : 'No resources yet'
                        }
                        message={
                            isFiltered
                                ? 'Try a different search or turn off the PDF filter.'
                                : 'Past papers, notes and guides shared by students will appear here.'
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
                                badges={
                                    post.file_path?.endsWith('.pdf') && (
                                        <TileBadge>
                                            <FileText className="size-3" />
                                            PDF
                                        </TileBadge>
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
