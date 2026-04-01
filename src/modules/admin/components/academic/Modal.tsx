import { type ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    subtitle?: string;
    onClose: () => void;
    title: string;
    children: ReactNode;
    subHeaderChildren?: ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children, subHeaderChildren }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-2xl flex items-center justify-center z-50" >
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <div className="flex items-center gap-2">
                            {subtitle && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Session: {subtitle}
                                </span>
                            )}
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer hover:bg-gray-200 rounded-sm px-1.5"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    {subHeaderChildren}
                </div>
                <div className="p-6 overflow-y-auto max-h-[50vh]" onScroll={(e) => e.stopPropagation()}>

                    {children}
                </div>


            </div>
        </div>
    );
}
