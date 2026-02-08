import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Achievement, BreadcrumbItem, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Achievements', href: '/achievements' },
];

type Props = {
    achievements: PaginatedData<Achievement>;
    filters: {
        search?: string;
    };
};

export default function AchievementIndex({ achievements, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/achievements', { search: search || undefined }, { preserveState: true, replace: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Achievements" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Student Achievements</h1>
                        <p className="text-muted-foreground">Celebrating student projects, awards, and alumni success.</p>
                    </div>
                    <Button asChild>
                        <Link href="/achievements/create">
                            <Plus className="mr-2 size-4" />
                            Share Achievement
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSearch} className="relative max-w-md">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search achievements..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                {achievements.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                        No achievements found. Be the first to share one!
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {achievements.data.map((achievement) => (
                            <div
                                key={achievement.id}
                                className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md"
                            >
                                <div className="aspect-video w-full bg-muted flex items-center justify-center relative overflow-hidden">
                                    {achievement.image_path ? (
                                        <img
                                            src={achievement.image_path}
                                            alt={achievement.title}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <Trophy className="size-12 text-muted-foreground/50" />
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className="rounded-full bg-black/50 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-white uppercase">
                                            {new Date(achievement.achieved_at).getFullYear()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                        {achievement.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                                        {achievement.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {achievement.user?.name}
                                        </span>
                                        <Button variant="ghost" size="sm" asChild className="h-8">
                                            <Link href={`/achievements/${achievement.id}`}>View Story</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {achievements.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {achievements.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`rounded-lg px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : link.url
                                          ? 'hover:bg-accent'
                                          : 'cursor-default text-muted-foreground'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
