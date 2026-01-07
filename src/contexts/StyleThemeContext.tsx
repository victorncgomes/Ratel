import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type StyleTheme = 'glassmorphism' | 'neobrutalist';

interface StyleThemeContextType {
    styleTheme: StyleTheme;
    setStyleTheme: (theme: StyleTheme) => void;
    isNeobrutalist: boolean;
    isGlassmorphism: boolean;
}

const StyleThemeContext = createContext<StyleThemeContextType | undefined>(undefined);

interface StyleThemeProviderProps {
    children: ReactNode;
}

export function StyleThemeProvider({ children }: StyleThemeProviderProps) {
    const [styleTheme, setStyleThemeState] = useState<StyleTheme>(() => {
        // Carregar do localStorage ou usar padrão
        const saved = localStorage.getItem('ratel-style-theme');
        return (saved === 'glassmorphism' || saved === 'neobrutalist') ? saved : 'neobrutalist';
    });

    // Aplicar classe no body quando tema muda
    useEffect(() => {
        document.body.classList.remove('glassmorphism', 'neobrutalist');
        document.body.classList.add(styleTheme);
        localStorage.setItem('ratel-style-theme', styleTheme);
    }, [styleTheme]);

    const setStyleTheme = (theme: StyleTheme) => {
        setStyleThemeState(theme);
    };

    return (
        <StyleThemeContext.Provider
            value={{
                styleTheme,
                setStyleTheme,
                isNeobrutalist: styleTheme === 'neobrutalist',
                isGlassmorphism: styleTheme === 'glassmorphism'
            }}
        >
            {children}
        </StyleThemeContext.Provider>
    );
}

export function useStyleTheme() {
    const context = useContext(StyleThemeContext);
    if (!context) {
        throw new Error('useStyleTheme must be used within a StyleThemeProvider');
    }
    return context;
}

// Classes utilitárias para componentes
export function getThemeClasses(styleTheme: StyleTheme) {
    if (styleTheme === 'neobrutalist') {
        return {
            card: 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none bg-white',
            cardHover: 'hover:shadow-[6px_6px_0_0_#000]',
            button: 'font-bold border-2 border-black shadow-[2px_2px_0_0_#000]',
            buttonPrimary: 'font-bold border-4 border-black shadow-[4px_4px_0_0_#000] bg-[#E63946] text-white',
            input: 'border-2 border-black shadow-[2px_2px_0_0_#000] bg-white',
            header: 'bg-white border-b-4 border-black',
            sidebar: 'bg-white border-r-4 border-black',
            sidebarSection: 'border-4 border-black p-3 shadow-[4px_4px_0_0_#000]',
            sidebarItem: 'border-2 border-black shadow-[2px_2px_0_0_#000]',
            sidebarItemActive: 'bg-[#E63946] text-white shadow-[3px_3px_0_0_#000]',
            avatar: 'border-4 border-black shadow-[4px_4px_0_0_#000]',
            badge: 'border-2 border-black shadow-[2px_2px_0_0_#000] font-bold',
            title: 'font-black',
        };
    }
    // Glassmorphism (tema original)
    return {
        card: 'glass-card rounded-xl border border-white/10',
        cardHover: 'hover:shadow-lg hover:border-white/20',
        button: 'font-medium rounded-lg',
        buttonPrimary: 'bg-primary text-primary-foreground shadow-md shadow-primary/20 rounded-lg',
        input: 'rounded-lg border bg-background/50 backdrop-blur',
        header: 'glass border-b border-white/10',
        sidebar: 'glass border-r border-white/10',
        sidebarSection: 'border-t border-border/50',
        sidebarItem: 'rounded-lg',
        sidebarItemActive: 'bg-primary text-primary-foreground shadow-md shadow-primary/20',
        avatar: 'border-4 border-background shadow-xl',
        badge: 'rounded-full',
        title: 'font-bold',
    };
}
