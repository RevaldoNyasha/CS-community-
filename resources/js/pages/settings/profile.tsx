import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                                    <input
                                        id="name"
                                        className="w-full bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />
                                    <InputError className="mt-1" message={errors.name} />
                                </div>

                                <div className="grid gap-1.5">
                                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="w-full bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />
                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-emerald-400">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="px-4 py-2 border border-primary/30 bg-primary/10 text-primary text-xs font-semibold rounded-md hover:bg-primary/20 transition-all disabled:opacity-50"
                                    >
                                        Save
                                    </button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-xs text-emerald-400">Saved</p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
