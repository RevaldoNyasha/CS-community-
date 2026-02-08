import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Star, Trash2, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Achievement, BreadcrumbItem, SharedData } from '@/types';

type Props = {
    achievement: Achievement;
    averageRating: number;
};

export default function AchievementShow({ achievement, averageRating }: Props) {
    const { auth } = usePage<SharedData>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Achievements', href: '/achievements' },
        { title: achievement.title, href: `/achievements/${achievement.id}` },
    ];

    const { data, setData, post: postRating, processing } = useForm({
        rating: 5,
        comment: '',
    });

    const submitRating = (e: React.FormEvent) => {
        e.preventDefault();
        postRating(`/achievements/${achievement.id}/rate`, {
            preserveScroll: true,
        });
    };

    const deleteAchievement = () => {
        if (confirm('Are you sure you want to delete this achievement?')) {
            router.delete(`/achievements/${achievement.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={achievement.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
                <Link href="/achievements" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to achievements
                </Link>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                            <div className="aspect-video w-full bg-muted flex items-center justify-center">
                                {achievement.image_path ? (
                                    <img src={achievement.image_path} alt={achievement.title} className="h-full w-full object-cover" />
                                ) : (
                                    <Trophy className="size-20 text-muted-foreground/30" />
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="size-3" />
                                                {new Date(achievement.achieved_at).toLocaleDateString()}
                                            </span>
                                            <span>&middot;</span>
                                            <span className="flex items-center gap-1">
                                                <User className="size-3" />
                                                By {achievement.user?.name}
                                            </span>
                                        </div>
                                        <h1 className="mt-2 text-3xl font-bold">{achievement.title}</h1>
                                    </div>
                                    {(auth.user.id === achievement.user_id || auth.user.is_admin) && (
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/achievements/${achievement.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={deleteAchievement}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap text-lg leading-relaxed">{achievement.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Community Impact</h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Star className="size-6 fill-current" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{averageRating.toFixed(1)} / 5.0</div>
                                    <div className="text-sm text-muted-foreground">Average Community Rating</div>
                                </div>
                            </div>

                            <form onSubmit={submitRating} className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold text-sm">Rate this Achievement</h3>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setData('rating', num)}
                                            className={`size-10 rounded-lg flex items-center justify-center border transition-colors ${
                                                data.rating >= num ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    Submit Rating
                                </Button>
                            </form>
                        </div>

                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Supporters</h2>
                            <div className="space-y-4">
                                {achievement.achievement_ratings?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No ratings yet. Be the first!</p>
                                ) : (
                                    achievement.achievement_ratings?.map((rating) => (
                                        <div key={rating.id} className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
                                                {rating.user?.name?.[0]}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">{rating.user?.name}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`size-3 ${i < rating.rating ? 'text-yellow-500 fill-current' : 'text-muted'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
