import { Link } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { login } from '@/routes';

type Props = {
    open: boolean;
    message?: string;
    onCancel: () => void;
};

export default function AuthPromptModal({
    open,
    message = 'Please login to perform this action.',
    onCancel,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) { onCancel(); } }}>
            <DialogContent className="max-w-sm bg-card border-border">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                            <LogIn className="size-4 text-primary" />
                        </span>
                        <DialogTitle className="text-base text-foreground">Login Required</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground pl-12">
                        {message}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-border text-muted-foreground text-xs font-semibold rounded-md hover:bg-secondary/40 transition-colors"
                    >
                        Cancel
                    </button>
                    <Link
                        href={login().url}
                        className="px-4 py-2 text-xs font-semibold rounded-md transition-all border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                    >
                        Login
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
