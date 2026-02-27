import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import emailjs from '@emailjs/browser';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

const EMAILJS_SERVICE_ID  = 'service_7n2dl0m';
const EMAILJS_TEMPLATE_ID = 'template_jpp2odd';
const EMAILJS_PUBLIC_KEY  = '74UTwMFilKvu2q1wj';

const underlineInput = "w-full bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-0 transition-colors";

export default function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('Password reset');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setSending(true);
        setError('');

        try {
            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    name: email,
                    message: message,
                },
                { publicKey: EMAILJS_PUBLIC_KEY },
            );
            if (result.status === 200) {
                setSent(true);
            } else {
                setError(`Unexpected response (${result.status}). Please try again.`);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(`Failed to send: ${msg}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <AuthLayout
            title="Contact Admin"
            description="Send a password reset request to the admin"
        >
            <Head title="Reset Password" />

            {!sent ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                    <div className="grid gap-1">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Use the same email you are trying to login with"
                            className={underlineInput}
                        />
                    </div>

                    <div className="grid gap-1">
                        <textarea
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Dont be dump like root, what happened"
                            rows={4}
                            className={`${underlineInput} resize-none`}
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-destructive/80 bg-destructive/10 border border-destructive/20 rounded-(--radius) px-2 py-1.5 wrap-break-word">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold tracking-wide hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center rounded-(--radius)"
                        >
                            {sending ? (
                                <>
                                    <Spinner className="mr-2" />
                                    Sending…
                                </>
                            ) : (
                                'Send reset request'
                            )}
                        </button>

                        <Link
                            href={login()}
                            className="w-full py-2.5 border border-border text-sm font-semibold tracking-wide text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center justify-center rounded-(--radius)"
                        >
                            Back to login
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col gap-4">
                    <p className="text-xs text-green-400/90 bg-green-400/10 border border-green-400/20 rounded-(--radius) px-3 py-2.5">
                        ✓ Email sent — admin will reset your password shortly.
                    </p>
                    <Link
                        href={login()}
                        className="w-full py-2.5 border border-border text-sm font-semibold tracking-wide text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center justify-center rounded-(--radius)"
                    >
                        Back to login
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
}
