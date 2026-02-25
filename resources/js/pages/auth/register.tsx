import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

const underlineInput = "w-full bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-0 transition-colors";

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
                className="flex flex-col gap-7"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1">
                            <input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                placeholder="Full name"
                                className={underlineInput}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-1">
                            <input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                name="email"
                                placeholder="Email address"
                                className={underlineInput}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1">
                            <input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                name="password"
                                placeholder="Password"
                                className={underlineInput}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-1">
                            <input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                name="password_confirmation"
                                placeholder="Confirm password"
                                className={underlineInput}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex flex-col gap-3 pt-1">
                            <button
                                type="submit"
                                tabIndex={5}
                                data-test="register-user-button"
                                className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold tracking-wide hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Create account
                            </button>

                            <p className="text-center text-xs text-muted-foreground pt-1">
                                Already have an account?{' '}
                                <TextLink href={login()} tabIndex={6} className="text-xs! text-foreground hover:text-foreground/80 font-medium">
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
