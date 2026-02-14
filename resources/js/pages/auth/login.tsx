import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

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
                className="space-y-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-bold mb-0.5 text-gray-800">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="email@example.com"
                                className="win95-sunken w-full bg-white px-2 py-1.5 text-xs focus:outline-none"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-0.5">
                                <label htmlFor="password" className="block text-[10px] font-bold text-gray-800">
                                    Password
                                </label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="!text-[9px] text-gray-600 underline hover:text-black"
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
                                className="win95-sunken w-full bg-white px-2 py-1.5 text-xs focus:outline-none"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="remember" className="flex items-center cursor-pointer">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    tabIndex={3}
                                    className="sr-only peer"
                                />
                                <span className="win95-sunken w-3.5 h-3.5 bg-white flex-shrink-0 mr-1.5 flex items-center justify-center peer-checked:[&>svg]:block">
                                    <svg className="w-2.5 h-2.5 text-black hidden" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </span>
                                <span className="text-[10px] text-gray-800">Remember me</span>
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="mc-btn w-full py-1.5 !bg-black !text-white font-bold text-xs tracking-widest hover:brightness-110 active:brightness-90 flex items-center justify-center disabled:opacity-50"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Log in
                            </button>
                        </div>

                        {canRegister && (
                            <div className="text-center pt-1">
                                <p className="text-[10px] text-gray-700">
                                    Don't have an account?{' '}
                                    <TextLink href={register()} tabIndex={5} className="!text-[10px] font-bold hover:text-black">
                                        Sign up
                                    </TextLink>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
