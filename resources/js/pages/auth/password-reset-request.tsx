import emailjs from '@emailjs/browser';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { authInputClass, authSubmitClass } from '@/components/auth-form-parts';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

const EMAILJS_SERVICE_ID = 'service_7n2dl0m';
const EMAILJS_TEMPLATE_ID = 'template_jpp2odd';
const EMAILJS_PUBLIC_KEY = '74UTwMFilKvu2q1wj';

export default function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [whatsappError, setWhatsappError] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const message = `Hi Admin,\nI am unable to access my account and need a password reset. You can reach me via WhatsApp or phone at: ${whatsapp || '[your number here]'}\nPlease send my new password to that number.\nThank you.`;

    function sanitizePhone(raw: string): string {
        return raw.replace(/\D/g, '');
    }

    function handleWhatsappChange(raw: string) {
        const sanitized = sanitizePhone(raw);
        setWhatsapp(sanitized);
        if (submitAttempted) {
            setWhatsappError(validatePhone(sanitized));
        }
    }

    function validatePhone(value: string): string {
        if (!value.trim()) {
            return 'WhatsApp or phone number is required so the admin can reach you.';
        }
        if (!value.startsWith('0')) {
            return 'Phone number must start with 0.';
        }
        if (value.length !== 10) {
            return `Phone number must be exactly 10 digits (${value.length}/10).`;
        }
        return '';
    }

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setSubmitAttempted(true);

        const phoneError = validatePhone(whatsapp);
        if (phoneError) {
            setWhatsappError(phoneError);
            return;
        }

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
                setError(
                    `Unexpected response (${result.status}). Please try again.`,
                );
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="relative grid gap-1">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Use the same email you are trying to login with"
                            className={authInputClass}
                        />
                    </div>

                    <div className="relative grid gap-1">
                        <input
                            type="tel"
                            value={whatsapp}
                            onChange={(e) =>
                                handleWhatsappChange(e.target.value)
                            }
                            placeholder="WhatsApp / phone number *"
                            className={`${authInputClass} ${whatsappError ? 'border-red-500' : ''}`}
                        />
                        {submitAttempted && whatsappError && (
                            <p className="pt-0.5 text-[11px] text-red-500">
                                {whatsappError}
                            </p>
                        )}
                    </div>

                    <div className="relative grid gap-1">
                        <textarea
                            readOnly
                            value={message}
                            rows={6}
                            className={`${authInputClass} cursor-default resize-none overflow-hidden text-xs! text-muted-foreground! select-none`}
                        />
                    </div>

                    {error && (
                        <p className="rounded-(--radius) border border-destructive/20 bg-destructive/10 px-2 py-1.5 text-xs wrap-break-word text-destructive/80">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={sending}
                            className={authSubmitClass}
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
                            className="flex w-full items-center justify-center rounded-lg border border-border bg-card/50 px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-card"
                        >
                            Back to login
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col gap-4">
                    <p className="rounded-(--radius) border border-green-400/20 bg-green-400/10 px-3 py-2.5 text-xs text-green-400/90">
                        Email sent — admin will reset your password shortly and
                        notify you on {whatsapp}.
                    </p>
                    <Link
                        href={login()}
                        className="flex w-full items-center justify-center rounded-lg border border-border bg-card/50 px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-card"
                    >
                        Back to login
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
}
