import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const underlineInput = "w-full bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-0 transition-colors";

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-7"
            >
                {({ processing, errors }) => (
                    <>
                        {status && (
                            <div className="text-center text-sm font-medium text-green-400">
                                {status}
                            </div>
                        )}

                        <div className="grid gap-1">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="Email address"
                                className={underlineInput}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1">
                            <div className="flex items-center justify-between pb-0.5">
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-xs! text-muted-foreground hover:text-foreground ml-auto"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Password"
                                className={underlineInput}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="remember" className="flex items-center cursor-pointer gap-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    tabIndex={3}
                                    className="sr-only peer"
                                />
                                <span className="w-4 h-4 border border-border bg-transparent rounded-none shrink-0 flex items-center justify-center peer-checked:[&>svg]:block">
                                    <svg className="w-2.5 h-2.5 text-foreground hidden" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </span>
                                <span className="text-xs text-muted-foreground">Remember me</span>
                            </label>
                        </div>

                        <div className="flex flex-col gap-3 pt-1">
                            <button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold tracking-wide hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Log in
                            </button>

                            <Link
                                href={home()}
                                tabIndex={6}
                                className="w-full py-2.5 border border-border text-sm font-semibold tracking-wide text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center justify-center"
                            >
                                Cancel
                            </Link>

                            {canRegister && (
                                <p className="text-center text-xs text-muted-foreground pt-1">
                                    Don&apos;t have an account?{' '}
                                    <TextLink href={register()} tabIndex={5} className="text-xs! text-foreground hover:text-foreground/80 font-medium">
                                        Sign up
                                    </TextLink>
                                </p>
                            )}
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
