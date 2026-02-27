import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import emailjs from '@emailjs/browser';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { home, register } from '@/routes';
import { store } from '@/routes/login';

const underlineInput = "w-full bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-0 transition-colors";

type Props = {
    status?: string;
    canRegister: boolean;
};

export default function Login({ status, canRegister }: Props) {
    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSending, setForgotSending] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);
    const [forgotError, setForgotError] = useState('');

    const handleForgotSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setForgotSending(true);
        setForgotError('');

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    user_email: forgotEmail,
                    to_email: import.meta.env.VITE_EMAILJS_ADMIN_EMAIL,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            );
            setForgotSent(true);
        } catch {
            setForgotError('Failed to send. Please try again.');
        } finally {
            setForgotSending(false);
        }
    };

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

                        <div className="flex flex-col gap-3 pt-1">
                            <button
                                type="submit"
                                tabIndex={3}
                                disabled={processing}
                                data-test="login-button"
                                className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold tracking-wide hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center rounded-(--radius)"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Log in
                            </button>

                            <Link
                                href={home()}
                                tabIndex={5}
                                className="w-full py-2.5 border border-border text-sm font-semibold tracking-wide text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center justify-center rounded-(--radius)"
                            >
                                Cancel
                            </Link>

                            {canRegister && (
                                <p className="text-center text-xs text-muted-foreground pt-1">
                                    Don&apos;t have an account?{' '}
                                    <TextLink href={register()} tabIndex={4} className="text-xs! text-foreground hover:text-foreground/80 font-medium">
                                        Sign up
                                    </TextLink>
                                </p>
                            )}

                            <div className="text-center">
                                {!forgotSent ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setForgotOpen((o) => !o)}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Forgot password?
                                        </button>

                                        {forgotOpen && (
                                            <form onSubmit={handleForgotSubmit} className="mt-3 flex flex-col gap-2 text-left">
                                                <input
                                                    type="email"
                                                    required
                                                    value={forgotEmail}
                                                    onChange={(e) => setForgotEmail(e.target.value)}
                                                    placeholder="Your email address"
                                                    className={underlineInput}
                                                />
                                                {forgotError && (
                                                    <p className="text-xs text-destructive">{forgotError}</p>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={forgotSending}
                                                    className="mt-1 w-full py-2 bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide hover:brightness-105 disabled:opacity-50 transition-all flex items-center justify-center rounded-(--radius)"
                                                >
                                                    {forgotSending && <Spinner className="mr-2" />}
                                                    Email admin to reset password
                                                </button>
                                            </form>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-green-400">
                                        Email sent! Admin will reset your password shortly.
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
