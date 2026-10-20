import { Form, Head, Link } from '@inertiajs/react';
import {
    authInputClass,
    authLabelClass,
    authSubmitClass,
    PasswordInput,
    SocialAuth,
} from '@/components/auth-form-parts';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';

type Props = {
    status?: string;
    canRegister: boolean;
};

export default function Login({ status, canRegister }: Props) {
    return (
        <AuthLayout
            title="Welcome back"
            description="Log in to your DEV-CRAFT account to continue."
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400">
                    {status}
                </div>
            )}

            <SocialAuth />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <label htmlFor="email" className={authLabelClass}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-invalid={!!errors.email}
                                className={authInputClass}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className={authLabelClass}
                                >
                                    Password
                                </label>
                                <Link
                                    href="/password-reset-request"
                                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                placeholder="Your password"
                                aria-invalid={!!errors.password}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                            <input
                                type="checkbox"
                                name="remember"
                                className="size-4 rounded border-border bg-background accent-primary"
                            />
                            Remember me
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            data-test="login-button"
                            className={authSubmitClass}
                        >
                            {processing && <Spinner />}
                            Log in
                        </button>
                    </>
                )}
            </Form>

            {canRegister && (
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                        href={register()}
                        className="font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                        Sign up
                    </Link>
                </p>
            )}
        </AuthLayout>
    );
}
