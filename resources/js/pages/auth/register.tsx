import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

const underlineInput = "w-full bg-transparent border-0 border-b-2 border-input dark:border-cyan-800/80 rounded-none px-0 py-2.5 text-[15px] font-medium text-foreground dark:text-gray-200 placeholder:text-muted-foreground dark:placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:border-primary dark:focus:border-cyan-400 focus:ring-0 transition-colors";

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description=""
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1 relative">
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

                        <div className="grid gap-1 relative">
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

                        <div className="grid gap-1 relative">
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

                        <div className="grid gap-1 relative">
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

                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                type="submit"
                                tabIndex={5}
                                data-test="register-user-button"
                                className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-[#00f0ff] dark:hover:bg-[#00f0ff]/90 dark:text-black text-[15px] font-bold tracking-wide shadow-md dark:shadow-none dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50 transition-all flex items-center justify-center rounded-lg"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Create account
                            </button>

                            <Link
                                href={home()}
                                tabIndex={7}
                                className="w-full py-2.5 border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:border-gray-600 dark:bg-[#141b26] text-[15px] font-medium tracking-wide dark:text-gray-300 dark:hover:text-white dark:hover:border-gray-400 dark:hover:bg-[#1f2937] transition-all flex items-center justify-center rounded-lg"
                            >
                                Cancel
                            </Link>

                            <div className="flex justify-center items-center text-[12px] text-muted-foreground pt-3 flex-wrap gap-2 transition-colors">
                                <p>
                                    Already have an account?{' '}
                                    <TextLink href={login()} tabIndex={6} className="text-[12px]! text-foreground hover:text-primary dark:text-white dark:hover:text-cyan-400 font-medium transition-colors">
                                        Log in
                                    </TextLink>
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
