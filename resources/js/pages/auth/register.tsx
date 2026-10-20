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
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title="Create your account"
            description="Join the CS community in under a minute."
        >
            <Head title="Sign up" />

            <SocialAuth />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <label htmlFor="name" className={authLabelClass}>
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder="Nyasha"
                                aria-invalid={!!errors.name}
                                className={authInputClass}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="email" className={authLabelClass}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="nyasha@gmail.com"
                                aria-invalid={!!errors.email}
                                className={authInputClass}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <label
                                htmlFor="password"
                                className={authLabelClass}
                            >
                                Password
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="new-password"
                                placeholder="Create a password"
                                aria-invalid={!!errors.password}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <label
                                htmlFor="password_confirmation"
                                className={authLabelClass}
                            >
                                Confirm password
                            </label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                aria-invalid={!!errors.password_confirmation}
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            data-test="register-user-button"
                            className={authSubmitClass}
                        >
                            {processing && <Spinner />}
                            Create account
                        </button>
                    </>
                )}
            </Form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    href={login()}
                    className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
}
