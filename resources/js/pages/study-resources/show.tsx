import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, StudyResource } from '@/types';

type Props = {
    resource: StudyResource;
};

export default function StudyResourceShow({ resource }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Study Resources', href: '/study-resources' },
        { title: resource.title, href: `/study-resources/${resource.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={resource.title} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Link href="/study-resources" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to resources
                </Link>

                <div className="rounded-xl border p-6">
                    <h1 className="text-2xl font-bold">{resource.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{resource.subject?.code} - {resource.subject?.name}</span>
                        <span>&middot;</span>
                        <span>Part {resource.subject?.part}</span>
                        <span>&middot;</span>
                        <span>{resource.year} Semester {resource.semester}</span>
                        <span>&middot;</span>
                        <span>by {resource.user?.name}</span>
                    </div>

                    {resource.description && (
                        <p className="mt-4 text-muted-foreground">{resource.description}</p>
                    )}

                    {resource.external_url && (
                        <a
                            href={resource.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <ExternalLink className="size-4" />
                            Open Resource
                        </a>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
