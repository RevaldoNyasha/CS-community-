import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, CareerResource, SharedData } from '@/types';

type Props = {
    resource: CareerResource;
};

export default function CareerGuidanceShow({ resource }: Props) {
    const { auth } = usePage<SharedData>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Career Guidance', href: '/career-guidance' },
        { title: resource.title, href: `/career-guidance/${resource.id}` },
    ];

    const deleteResource = () => {
        if (confirm('Are you sure you want to delete this resource?')) {
            router.delete(`/career-guidance/${resource.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={resource.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
                <Link href="/career-guidance" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to career guidance
                </Link>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary uppercase">
                                    {resource.type}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    {new Date(resource.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h1 className="mt-2 text-3xl font-bold">{resource.title}</h1>
                        </div>
                        {auth.user.is_admin && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/career-guidance/${resource.id}/edit`}>Edit</Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={deleteResource}>
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 mb-6">
                            <Briefcase className="size-10 text-primary shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg">Opportunity Details</h3>
                                <p className="text-sm text-muted-foreground">Category: {resource.type}</p>
                            </div>
                        </div>

                        <p className="whitespace-pre-wrap text-lg leading-relaxed">{resource.content}</p>

                        {resource.external_url && (
                            <div className="mt-8 p-6 border rounded-xl bg-accent/20 flex flex-col items-center text-center">
                                <h3 className="font-bold text-xl mb-2">Interested in this opportunity?</h3>
                                <p className="text-muted-foreground mb-6">Follow the link below to apply or find more information on the official website.</p>
                                <Button size="lg" asChild>
                                    <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                                        Visit External Website
                                        <ExternalLink className="ml-2 size-4" />
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
