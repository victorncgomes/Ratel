import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/Button";
import { useStyleTheme } from "../../contexts/StyleThemeContext";

interface ConfirmUnsubscribeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    senderName: string;
    senderEmail: string;
}

export function ConfirmUnsubscribeDialog({
    isOpen,
    onClose,
    onConfirm,
    senderName,
    senderEmail,
}: ConfirmUnsubscribeDialogProps) {
    const { isNeobrutalist } = useStyleTheme();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-[425px] ${isNeobrutalist ? 'border-4 border-black shadow-[8px_8px_0_0_#000]' : ''}`}>
                <DialogHeader>
                    <DialogTitle className={isNeobrutalist ? 'uppercase font-black' : ''}>Cancelar inscrição</DialogTitle>
                    <DialogDescription className="pt-2">
                        Quer parar de receber mensagens de <strong>{senderName}</strong> ({senderEmail})?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 mt-4">
                    <Button variant="ghost" onClick={onClose} className={isNeobrutalist ? 'border-2 border-transparent hover:border-black' : ''}>
                        Cancelar
                    </Button>
                    <Button
                        variant={isNeobrutalist ? "default" : "default"}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`bg-blue-600 hover:bg-blue-700 text-white ${isNeobrutalist ? 'border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]' : 'rounded-full'}`}
                    >
                        Cancelar inscrição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
