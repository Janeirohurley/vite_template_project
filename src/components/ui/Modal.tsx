import { X, AlertCircle, CheckCircle, Info, ShieldAlert } from "lucide-react";

type Modal = "info" | "success" | "danger" | "warning" | "custom";

interface ModalProps {
    open: boolean;
    type?: Modal;
    title: string;
    description?: string;
    actions?: React.ReactNode; // Boutons personnalisés
    onClose: () => void;
}

export function Modal({
    open,
    type = "info",
    title,
    description,
    actions,
    onClose
}: ModalProps) {

    if (!open) return null;

    // Styles par type
    const typeStyles = {
        info: {
            icon: <Info className="text-blue-500" size={26} />,
        },
        success: {
            icon: <CheckCircle className="text-green-500" size={26} />,
        },
        danger: {
            icon: <AlertCircle className="text-red-500" size={26} />,
        },
        warning: {
            icon: <ShieldAlert className="text-yellow-500" size={26} />,
        },
        custom: {
            icon: null
        }
    };

    return (
        <div
            className="
                fixed inset-0 z-50 
                bg-black/40 backdrop-blur-sm
                flex items-center justify-center
                p-4
            "
        >
            <div
                className="
                    w-full max-w-md 
                    bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-gray-100
                    rounded-2xl shadow-2xl border 
                    border-gray-200 dark:border-gray-700
                    p-6 relative
                    animate-in fade-in zoom-in duration-200
                "
            >
                {/* Bouton fermer (toujours présent) */}
                <button
                    onClick={onClose}
                    className="
                        absolute top-3 right-3
                        p-1 rounded-lg
                        text-gray-500 dark:text-gray-400
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        transition
                    "
                >
                    <X size={20} />
                </button>

                {/* Icone par type */}
                {type !== "custom" && (
                    <div className="mb-3 flex justify-center">
                        {typeStyles[type].icon}
                    </div>
                )}

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-2">
                    {title}
                </h2>

                {/* Description */}
                {description && (
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Actions (optionnel) */}
                {actions && (
                    <div className="mt-4 flex justify-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
