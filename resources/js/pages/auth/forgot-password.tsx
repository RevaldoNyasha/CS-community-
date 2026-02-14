import { Form, Head, Link } from '@inertiajs/react';
import { Frown } from 'lucide-react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Reset Password"
            description=""
        >
            <Head title="Reset Password" />

            {status && (
                <div className="mb-3 text-center text-[10px] font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="flex gap-3 mb-5">
                <div className="win95-sunken bg-[#c0c0c0] p-2 flex items-start justify-center shrink-0">
                    <Frown className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-[11px] text-gray-800 leading-relaxed">
                    Please enter your email address to receive a password reset link. Ensure you have access to this inbox to complete the process.
                </p>
            </div>

            <Form {...email.form()}>
                {({ processing, errors }) => (
                    <>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-[10px] font-bold mb-0.5 text-gray-800">
                                Email address:
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="off"
                                autoFocus
                                placeholder="email@example.com"
                                className="win95-sunken w-full bg-white px-2 py-1.5 text-xs focus:outline-none"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                                className="mc-btn px-4 py-1.5 text-[11px] font-bold flex items-center justify-center disabled:opacity-50"
                            >
                                {processing && <Spinner className="mr-1.5" />}
                                Send Reset Link
                            </button>
                            <Link
                                href={login()}
                                className="mc-btn px-4 py-1.5 text-[11px] font-bold text-center inline-block"
                            >
                                Cancel
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
