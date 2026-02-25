import { Head, useForm } from '@inertiajs/react';
import { X, Paperclip } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Submit Post', href: '/posts/create' },
];

/* Shared field styles mirroring the reference */
const inputClass =
    'w-full bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border transition-all outline-none text-sm';
const labelClass =
    'block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1';

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

            <div className="flex-1 overflow-hidden">
                <div className="p-6 md:p-8 h-full">
                    <div className="max-w-2xl w-full mx-auto h-full flex flex-col">

                        {/* ── Header ── */}
                        <header className="mb-4 shrink-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                                        Submit a Post
                                    </h1>
                                    <p className="text-muted-foreground text-sm">
                                        Share a resource or hackathon. Your post will be reviewed before publishing.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    form="post-form"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-md shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                                >
                                    {processing ? 'Submitting...' : 'Submit for Review'}
                                </button>
                            </div>
                        </header>

                        {/* ── Form ── */}
                        <form id="post-form" onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto">

                            {/* Type */}
                            <div className="space-y-2">
                                <label htmlFor="post-type" className={labelClass}>Type</label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value as 'resource' | 'hackathon')}>
                                    <SelectTrigger className={inputClass}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="resource" className="rounded-md">Resource</SelectItem>
                                        <SelectItem value="hackathon" className="rounded-md">Hackathon</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-xs text-destructive mt-1">{errors.type}</p>}
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <label htmlFor="post-title" className={labelClass}>Title</label>
                                <input
                                    id="post-title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className={inputClass}
                                    placeholder="Give your post a catchy title"
                                />
                                {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <label htmlFor="post-content" className={labelClass}>Content</label>
                                <textarea
                                    id="post-content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className={inputClass + ' resize-none'}
                                    placeholder="Describe your resource or hackathon in detail..."
                                    rows={4}
                                />
                                {errors.content && <p className="text-xs text-destructive mt-1">{errors.content}</p>}
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label htmlFor="post-tags" className={labelClass}>
                                    Tags{' '}
                                    <span className="lowercase font-normal opacity-70">(comma-separated, max 5)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-muted-foreground/60 text-[20px]">sell</span>
                                    </div>
                                    <input
                                        id="post-tags"
                                        type="text"
                                        value={data.tags}
                                        onChange={(e) => setData('tags', e.target.value)}
                                        className={inputClass + ' pl-10'}
                                        placeholder="react, typescript, tailwind"
                                    />
                                </div>
                                {errors.tags && <p className="text-xs text-destructive mt-1">{errors.tags}</p>}
                            </div>

                            {/* Attachment */}
                            <div className="space-y-2">
                                <label className={labelClass}>
                                    Attachment{' '}
                                    <span className="lowercase font-normal opacity-70">(optional)</span>
                                </label>

                                {data.attachment ? (
                                    /* Selected file row */
                                    <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background text-sm">
                                        <Paperclip className="size-3 shrink-0 text-primary" />
                                        <span className="truncate text-foreground flex-1 text-xs">{data.attachment.name}</span>
                                        <span className="shrink-0 text-muted-foreground text-xs">
                                            ({(data.attachment.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setData('attachment', null)}
                                            className="ml-1 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ) : (
                                    /* Drag-and-drop zone */
                                    <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 bg-muted/10 hover:border-primary/50 transition-all cursor-pointer">
                                        <span className="material-symbols-outlined text-2xl text-muted-foreground/50 group-hover:text-primary transition-colors mb-1">
                                            cloud_upload
                                        </span>
                                        <p className="text-xs font-medium text-foreground">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF or image (JPG, PNG, GIF, WebP). Max 7 MB.</p>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                                            onChange={(e) => setData('attachment', e.target.files?.[0] ?? null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                    </label>
                                )}
                                {errors.attachment && <p className="text-xs text-destructive mt-1">{errors.attachment}</p>}
                            </div>

                            {/* Upload progress */}
                            {progress && (
                                <div className="space-y-1">
                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-200"
                                            style={{ width: `${progress.percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Uploading… {progress.percentage}%</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
