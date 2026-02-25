import { TriangleAlert } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Props = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    confirmVariant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
};

const variantStyles = {
    danger: 'border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20',
    warning: 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
    primary: 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20',
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    confirmVariant = 'danger',
    onConfirm,
    onCancel,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) { onCancel(); } }}>
            <DialogContent className="max-w-sm bg-card border-border">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                            <TriangleAlert className="size-4 text-amber-400" />
                        </span>
                        <DialogTitle className="text-base text-foreground">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground pl-12">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-border text-muted-foreground text-xs font-semibold rounded-md hover:bg-secondary/40 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${variantStyles[confirmVariant]}`}
                    >
                        {confirmLabel}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
