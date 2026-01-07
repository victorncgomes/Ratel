import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 5000,
    action,
    onClose,
}) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Aguardar animação de saída
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    const colorClasses = {
        neumorphism: {
            success: 'bg-neomorph-success text-white',
            error: 'bg-neomorph-error text-white',
            warning: 'bg-neomorph-warning text-white',
            info: 'bg-neomorph-primary text-white',
        },
        material: {
            success: 'bg-material-success text-white',
            error: 'bg-material-error text-white',
            warning: 'bg-material-warning text-white',
            info: 'bg-material-primary text-white',
        },
        tokyo: {
            success: 'card-tokyo bg-tokyo-success bg-opacity-20 text-tokyo-success border border-tokyo-success border-opacity-30',
            error: 'card-tokyo bg-tokyo-error bg-opacity-20 text-tokyo-error border border-tokyo-error border-opacity-30',
            warning: 'card-tokyo bg-tokyo-warning bg-opacity-20 text-tokyo-warning border border-tokyo-warning border-opacity-30',
            info: 'card-tokyo bg-tokyo-primary bg-opacity-20 text-tokyo-primary border border-tokyo-primary border-opacity-30',
        },
    };

    return (
        <div
            className={`
        fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        min-w-[300px] max-w-md
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${colorClasses[theme][type]}
      `}
        >
            {/* Ícone */}
            <div className="flex-shrink-0">
                {icons[type]}
            </div>

            {/* Mensagem */}
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>

            {/* Ação */}
            {action && (
                <button
                    onClick={() => {
                        action.onClick();
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="flex-shrink-0 px-3 py-1 text-sm font-semibold underline hover:no-underline transition-all"
                >
                    {action.label}
                </button>
            )}

            {/* Botão fechar */}
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="flex-shrink-0 p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
                aria-label="Fechar"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// Hook para gerenciar toasts
interface ToastOptions {
    message: string;
    type?: ToastType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useToast = () => {
    const [toasts, setToasts] = useState<Array<ToastOptions & { id: number }>>([]);

    const showToast = (options: ToastOptions) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { ...options, id }]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    action={toast.action}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );

    return { showToast, ToastContainer };
};
