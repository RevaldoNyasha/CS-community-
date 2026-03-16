import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { redirect as githubRedirect } from '@/actions/App/Http/Controllers/Auth/GithubAuthController';
import { redirect as googleRedirect } from '@/actions/App/Http/Controllers/Auth/GoogleAuthController';

const underlineInput = "w-full bg-transparent border-0 border-b-2 border-input dark:border-cyan-800/80 rounded-none px-0 py-2.5 text-[15px] font-medium text-foreground dark:text-gray-200 placeholder:text-muted-foreground dark:placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:border-primary dark:focus:border-cyan-400 focus:ring-0 transition-colors";

type Props = {
    status?: string;
    canRegister: boolean;
};

export default function Login({ status, canRegister }: Props) {
    return (
        <AuthLayout
            title="Log in"
            description=""
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        {status && (
                            <div className="text-center text-sm font-medium text-green-500 dark:text-green-400 transition-colors">
                                {status}
                            </div>
                        )}

                        <div className="grid gap-1 relative">
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

                        <div className="grid gap-1 relative">
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

                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                type="submit"
                                tabIndex={3}
                                disabled={processing}
                                data-test="login-button"
                                className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-[#00f0ff] dark:hover:bg-[#00f0ff]/90 dark:text-black text-[15px] font-bold tracking-wide shadow-md dark:shadow-none dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50 transition-all flex items-center justify-center rounded-lg"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Log in
                            </button>

                            <a
                                href={googleRedirect.url()}
                                tabIndex={4}
                                className="w-full py-2.5 border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:border-gray-700 dark:bg-[#141b26] dark:hover:bg-[#1f2937] dark:hover:border-gray-500 text-[15px] font-medium tracking-wide dark:text-gray-300 dark:hover:text-white transition-all flex items-center justify-center gap-2 rounded-lg"
                            >
                                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </a>

                            <a
                                href={githubRedirect.url()}
                                tabIndex={5}
                                className="w-full py-2.5 border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:border-gray-700 dark:bg-[#141b26] dark:hover:bg-[#1f2937] dark:hover:border-gray-500 text-[15px] font-medium tracking-wide dark:text-gray-300 dark:hover:text-white transition-all flex items-center justify-center gap-2 rounded-lg"
                            >
                                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                Continue with GitHub
                            </a>

                            <Link
                                href={home()}
                                tabIndex={7}
                                className="w-full py-2.5 border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:border-gray-600 dark:bg-[#141b26] text-[15px] font-medium tracking-wide dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-400 dark:hover:bg-[#1f2937] transition-all flex items-center justify-center rounded-lg"
                            >
                                Cancel
                            </Link>

                            <div className="flex justify-between items-center text-[12px] text-muted-foreground pt-3 flex-wrap gap-2 transition-colors">
                                {canRegister && (
                                    <p>
                                        Don&apos;t have an account?{' '}
                                        <TextLink href={register()} tabIndex={4} className="text-[12px]! text-foreground hover:text-primary dark:text-white dark:hover:text-cyan-400 font-medium transition-colors ml-2">
                                            Sign up
                                        </TextLink>
                                    </p>
                                )}

                                <p>
                                    <Link
                                        href="/password-reset-request"
                                        className="hover:text-primary dark:hover:text-cyan-400 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
