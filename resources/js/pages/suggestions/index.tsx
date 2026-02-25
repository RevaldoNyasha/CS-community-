import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Suggestion } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Suggestions', href: '/suggestions' },
];

type Props = { suggestions: PaginatedData<Suggestion> };

export default function SuggestionsIndex({ suggestions }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({ message: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/suggestions', { onSuccess: () => reset() });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suggestions" />

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
                <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">

                    {/* ── Header ── */}
                    <header className="mb-10">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                            Suggestions
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Submit feedback and suggestions to the admin team. We value your input to help improve the platform.
                        </p>
                    </header>

                    {/* ── Submit section ── */}
                    <section className="mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                            Your Suggestion
                        </h2>

                        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-4">
                                    <textarea
                                        id="suggestion-box"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full bg-background border border-border text-foreground rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3fb950]/20 focus:border-[#3fb950] transition-all placeholder:text-muted-foreground/50 resize-none"
                                        placeholder="Share your ideas, feedback, or suggestions to help improve our platform..."
                                        rows={6}
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-xs text-destructive">{errors.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.message.trim()}
                                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">send</span>
                                                Submit Suggestion
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    {/* ── Previous suggestions ── */}
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                            Your Previous Suggestions
                        </h2>

                        {suggestions.data.length === 0 ? (
                            /* Empty state — dashed border */
                            <div className="border-2 border-dashed border-border rounded-xl py-20 px-6 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <span className="material-icons-outlined text-muted-foreground/50">history</span>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">
                                    You haven&apos;t submitted any suggestions yet.
                                </p>
                                <p className="text-muted-foreground/50 text-xs mt-1">
                                    Your contribution history will appear here once you start sharing.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {suggestions.data.map((suggestion: Suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="bg-card border border-border rounded-lg p-5 shadow-sm"
                                    >
                                        <p className="text-sm text-foreground leading-relaxed">{suggestion.message}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(suggestion.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3fb950]/10 text-[#3fb950] border border-[#3fb950]/20 font-semibold uppercase tracking-wider">
                                                Submitted
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
