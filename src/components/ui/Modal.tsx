import React, { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    actions,
    size = 'md',
}) => {
    const { theme } = useTheme();

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
    };

    const themeClasses = {
        neumorphism: 'card-neomorph bg-neomorph-surface text-neomorph-text',
        material: 'card-material bg-material-surface text-material-text shadow-material-3',
        tokyo: 'card-tokyo bg-tokyo-surface text-tokyo-text',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative w-full ${sizeClasses[size]} ${themeClasses[theme]} animate-slide-up`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || description) && (
                    <div className="mb-4">
                        {title && (
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                                    aria-label="Fechar"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {description && (
                            <p className="text-sm opacity-70">{description}</p>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="mb-6">
                    {children}
                </div>

                {/* Actions */}
                {actions && (
                    <div className="flex gap-2 justify-end">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};
