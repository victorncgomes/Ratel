import React, { useState } from 'react';
import { useTheme, Theme } from '../../hooks/useTheme';

export const ThemeSelector: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes: Array<{ id: Theme; name: string; description: string; icon: string }> = [
        {
            id: 'neumorphism',
            name: 'Neumorphism',
            description: 'Estilo Microsoft com sombras soft',
            icon: '🔷',
        },
        {
            id: 'material',
            name: 'Material Design',
            description: 'Estilo Google com elevações',
            icon: '🔶',
        },
        {
            id: 'tokyo',
            name: 'Tokyo Nights',
            description: 'Dark com glassmorphism e neon',
            icon: '🌃',
        },
    ];

    const currentTheme = themes.find((t) => t.id === theme);

    return (
        <div className="relative">
            {/* Botão do seletor */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-black hover:bg-opacity-5"
                aria-label="Selecionar tema"
            >
                <span className="text-xl">{currentTheme?.icon}</span>
                <span className="hidden md:inline text-sm font-medium">
                    {currentTheme?.name}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Overlay para fechar ao clicar fora */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-64 z-50 animate-slide-down">
                        <div
                            className={`
                p-2 rounded-lg shadow-lg
                ${theme === 'neumorphism' ? 'card-neomorph bg-neomorph-surface' : ''}
                ${theme === 'material' ? 'card-material bg-material-surface shadow-material-2' : ''}
                ${theme === 'tokyo' ? 'card-tokyo bg-tokyo-surface' : ''}
              `}
                        >
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setTheme(t.id);
                                        setIsOpen(false);
                                    }}
                                    className={`
                    w-full flex items-start gap-3 p-3 rounded-lg
                    transition-all text-left
                    ${theme === t.id ? 'bg-black bg-opacity-10' : 'hover:bg-black hover:bg-opacity-5'}
                  `}
                                >
                                    <span className="text-2xl flex-shrink-0">{t.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm">{t.name}</div>
                                        <div className="text-xs opacity-70 mt-0.5">{t.description}</div>
                                    </div>
                                    {theme === t.id && (
                                        <svg className="w-5 h-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
