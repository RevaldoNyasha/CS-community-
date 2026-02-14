import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div>
                            <label htmlFor="name" className="block text-[10px] font-bold mb-0.5 text-gray-800">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                placeholder="Full name"
                                className="win95-sunken w-full bg-white px-2 py-1.5 text-xs focus:outline-none"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-[10px] font-bold mb-0.5 text-gray-800">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                name="email"
                                placeholder="email@example.com"
                                className="win95-sunken w-full bg-white px-2 py-1.5 text-xs focus:outline-none"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[10px] font-bold mb-0.5 text-gray-800">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                name="password"
                                placeholder="Password"
                                className="win95-sunken w-full bg-white px-2 py-1.5 text-xs focus:outline-none"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-[10px] font-bold mb-0.5 text-gray-800">
                                Confirm password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                name="password_confirmation"
                                placeholder="Confirm password"
                                className="win95-sunken w-full bg-white px-2 py-1.5 text-xs focus:outline-none"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                tabIndex={5}
                                data-test="register-user-button"
                                className="mc-btn w-full py-1.5 !bg-black !text-white font-bold text-xs tracking-widest hover:brightness-110 active:brightness-90 flex items-center justify-center disabled:opacity-50"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Create account
                            </button>
                        </div>

                        <div className="text-center pt-1">
                            <p className="text-[10px] text-gray-700">
                                Already have an account?{' '}
                                <TextLink href={login()} tabIndex={6} className="!text-[10px] font-bold hover:text-black">
                                    Log in
                                </TextLink>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
