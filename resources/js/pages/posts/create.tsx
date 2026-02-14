import { Head, useForm } from '@inertiajs/react';
import { Paperclip, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Submit Post', href: '/posts/create' },
];

export default function PostCreate() {
    const { data, setData, post, processing, errors, progress } = useForm({
        title: '',
        content: '',
        type: 'resource',
        tags: '',
        attachment: null as File | null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/posts');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submit Post" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight uppercase font-mono text-brutal-green">Submit a Post</h1>
                    <p className="text-muted-foreground">Share a resource or hackathon. Your post will be reviewed by admins before publishing.</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium mb-1 uppercase text-brutal-green font-mono">
                            Type
                        </label>
                        <select
                            id="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full mc-slot px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brutal-green"
                        >
                            <option value="resource">Resource</option>
                            <option value="hackathon">Hackathon</option>
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-400">{errors.type}</p>}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1 uppercase text-brutal-green font-mono">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full mc-slot px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brutal-green"
                            placeholder="Give your post a title"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1 uppercase text-brutal-green font-mono">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full mc-slot px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brutal-green min-h-[200px]"
                            placeholder="Describe your resource or hackathon in detail..."
                        />
                        {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content}</p>}
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium mb-1 uppercase text-brutal-green font-mono">
                            Tags <span className="text-muted-foreground font-normal normal-case">(comma-separated, max 5)</span>
                        </label>
                        <input
                            id="tags"
                            type="text"
                            value={data.tags}
                            onChange={(e) => setData('tags', e.target.value)}
                            className="w-full mc-slot px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brutal-green"
                            placeholder="react, typescript, tailwind"
                        />
                        {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
                    </div>

                    <div>
                        <label htmlFor="attachment" className="block text-sm font-medium mb-1 uppercase text-brutal-green font-mono">
                            Attachment <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                        </label>
                        {data.attachment ? (
                            <div className="flex items-center gap-2 mc-slot px-3 py-2 text-sm">
                                <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                                <span className="truncate">{data.attachment.name}</span>
                                <span className="shrink-0 text-muted-foreground">
                                    ({(data.attachment.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setData('attachment', null)}
                                    className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <input
                                id="attachment"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                onChange={(e) => setData('attachment', e.target.files?.[0] ?? null)}
                                className="w-full mc-slot px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-brutal-green file:px-2 file:py-1 file:text-xs file:font-medium file:text-black focus:outline-none focus:ring-2 focus:ring-brutal-green"
                            />
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                            PDF or image (JPG, PNG, GIF, WebP). Max 7 MB.
                        </p>
                        {errors.attachment && <p className="mt-1 text-sm text-red-400">{errors.attachment}</p>}
                    </div>

                    {progress && (
                        <div className="space-y-1">
                            <div className="h-3 w-full border-2 border-black bg-black/20">
                                <div
                                    className="h-full bg-brutal-green transition-all duration-200"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Uploading... {progress.percentage}%</p>
                        </div>
                    )}

                    <button type="submit" disabled={processing} className="mc-btn disabled:opacity-50">
                        Submit for Approval
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
