import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { redirect as githubRedirect } from '@/actions/App/Http/Controllers/Auth/GithubAuthController';
import { redirect as googleRedirect } from '@/actions/App/Http/Controllers/Auth/GoogleAuthController';
import { cn } from '@/lib/utils';

export const authInputClass =
    'block w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none aria-invalid:border-destructive';

export const authLabelClass = 'text-sm font-medium text-foreground';

export const authSubmitClass =
    'flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60';

export function PasswordInput({
    className,
    ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                {...props}
                type={visible ? 'text' : 'password'}
                className={cn(authInputClass, 'pr-10', className)}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
            >
                {visible ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </button>
        </div>
    );
}

const socialButtonClass =
    'flex items-center justify-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-card';

// Google / GitHub sign-in, followed by an "or continue with email" divider.
export function SocialAuth() {
    return (
        <>
            <div className="grid grid-cols-2 gap-3">
                <a href={googleRedirect.url()} className={socialButtonClass}>
                    <svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        aria-hidden="true"
                    >
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </a>
                <a href={githubRedirect.url()} className={socialButtonClass}>
                    <svg
                        viewBox="0 0 24 24"
                        className="size-4 fill-current"
                        aria-hidden="true"
                    >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                </a>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or continue with email
                <span className="h-px flex-1 bg-border" />
            </div>
        </>
    );
}
