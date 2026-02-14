import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Suggestion } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Suggestions', href: '/suggestions' },
];

type Props = {
    suggestions: PaginatedData<Suggestion>;
};

export default function SuggestionsIndex({ suggestions }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/suggestions', {
            onSuccess: () => reset(),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suggestions" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">Suggestions</h1>
                    <p className="text-muted-foreground">Submit feedback and suggestions to the admin team.</p>
                </div>

                <form onSubmit={handleSubmit} className="mc-container">
                    <label htmlFor="message" className="block text-sm font-medium mb-2 uppercase text-brutal-green font-mono">
                        Your Suggestion
                    </label>
                    <textarea
                        id="message"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        className="w-full mc-slot px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brutal-green min-h-[100px]"
                        placeholder="What would you like to suggest?"
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                    <button type="submit" disabled={processing} className="mc-btn mt-3 disabled:opacity-50">
                        Submit Suggestion
                    </button>
                </form>

                <div>
                    <h2 className="mb-3 text-lg font-semibold uppercase font-mono text-brutal-green">Your Suggestions</h2>
                    {suggestions.data.length === 0 ? (
                        <div className="mc-container text-center text-muted-foreground">
                            You haven&apos;t submitted any suggestions yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {suggestions.data.map((suggestion) => (
                                <div key={suggestion.id} className="mc-container">
                                    <p className="text-sm">{suggestion.message}</p>
                                    <span className="mt-2 block text-xs text-muted-foreground">
                                        {new Date(suggestion.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
