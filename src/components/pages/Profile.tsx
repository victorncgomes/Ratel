import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Mail, MapPin, Calendar, Monitor, Languages, Type } from 'lucide-react';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import { useProgression } from '../../hooks/useProgression';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

// Componente de seleção de tema visual
function StyleThemeSelector() {
    const { styleTheme, setStyleTheme } = useStyleTheme();

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Card Glassmorphism */}
            <div
                onClick={() => setStyleTheme('glassmorphism')}
                className={cn(
                    "cursor-pointer p-4 transition-all",
                    styleTheme === 'glassmorphism'
                        ? 'border-2 border-blue-500 bg-blue-50 shadow-lg rounded-xl'
                        : 'border-2 border-gray-200 hover:border-gray-300 rounded-xl'
                )}
            >
                {/* Preview Glassmorphism */}
                <div className="h-16 mb-3 bg-gradient-to-br from-blue-400/30 to-purple-400/30 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center">
                    <div className="w-8 h-2 bg-white/50 rounded-full" />
                </div>
                <p className="font-bold text-sm">Glassmorphism</p>
                <p className="text-xs text-muted-foreground">Blur, transparências, cantos arredondados</p>
            </div>

            {/* Card Neobrutalist */}
            <div
                onClick={() => setStyleTheme('neobrutalist')}
                className={cn(
                    "cursor-pointer p-4 transition-all",
                    styleTheme === 'neobrutalist'
                        ? 'border-4 border-black bg-[#E63946]/10 shadow-[4px_4px_0_0_#000]'
                        : 'border-4 border-gray-300 hover:border-black shadow-[2px_2px_0_0_#ccc] hover:shadow-[3px_3px_0_0_#000]'
                )}
            >
                {/* Preview Neobrutalist */}
                <div className="h-16 mb-3 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center">
                    <div className="w-8 h-2 bg-[#E63946]" />
                </div>
                <p className="font-black text-sm">Neobrutalist</p>
                <p className="text-xs text-muted-foreground">Bordas pretas, sombras offset, cantos retos</p>
            </div>
        </div>
    );
}

// Hook for density and font size preferences
function useDisplayPreferences() {
    const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>(() => {
        return (localStorage.getItem('ratel_density') as 'compact' | 'comfortable' | 'spacious') || 'comfortable';
    });
    const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(() => {
        return (localStorage.getItem('ratel_font_size') as 'small' | 'medium' | 'large') || 'medium';
    });

    useEffect(() => {
        localStorage.setItem('ratel_density', density);
        document.documentElement.setAttribute('data-density', density);
    }, [density]);

    useEffect(() => {
        localStorage.setItem('ratel_font_size', fontSize);
        document.documentElement.setAttribute('data-font-size', fontSize);
        // Apply font size to root
        const sizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizes[fontSize];
    }, [fontSize]);

    return { density, setDensity, fontSize, setFontSize };
}

interface ProfileProps {
    user?: {
        name: string;
        email: string;
        photo: string;
        provider: string;
    } | null;
}

export function ProfilePage({ user }: ProfileProps) {
    const { level, currentRank, currentXP, nextLevelXP } = useProgression();
    const { language } = useLanguage();
    const { isNeobrutalist } = useStyleTheme();
    const { density, setDensity, fontSize, setFontSize } = useDisplayPreferences();
    const [showDensityMenu, setShowDensityMenu] = useState(false);
    const [showFontMenu, setShowFontMenu] = useState(false);

    const rankName = currentRank.name[language as 'pt' | 'en' | 'es'] || currentRank.name.pt;
    const xpProgress = Math.min(100, Math.max(0, (currentXP / nextLevelXP) * 100));

    const isDemo = !user || user.provider === 'demo';
    const displayName = isDemo ? 'Usuário Demo' : user?.name || 'Usuário';
    const displayEmail = isDemo ? 'demo@ratel.app' : user?.email || '';
    const displayInitial = displayName.charAt(0).toUpperCase();
    const displayPhoto = isDemo ? '' : user?.photo || '';
    const providerLabel = isDemo ? 'Demo' : user?.provider === 'google' ? 'Google' : 'Microsoft';

    // Card styling based on theme
    const cardClass = cn(
        "transition-all duration-200",
        isNeobrutalist
            ? "border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none"
            : "border border-gray-200/50 shadow-lg rounded-xl bg-white/70 backdrop-blur-sm"
    );

    const buttonClass = cn(
        "font-bold transition-all",
        isNeobrutalist
            ? "border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none"
            : "border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
    );

    const inputClass = cn(
        isNeobrutalist
            ? "border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none"
            : "border border-gray-200 rounded-lg shadow-sm"
    );

    const densityLabels = {
        compact: 'Compacta',
        comfortable: 'Confortável',
        spacious: 'Espaçosa'
    };

    const fontLabels = {
        small: 'Pequena (14px)',
        medium: 'Média (16px)',
        large: 'Grande (18px)'
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cover Image removida conforme solicitação */}
            <div className="pt-8" />

            {/* Profile Info */}
            <div className="px-8 pb-8 flex flex-col md:flex-row items-end md:items-start gap-6">
                <Avatar className={cn(
                    "h-32 w-32",
                    isNeobrutalist
                        ? "border-4 border-black shadow-[6px_6px_0_0_#000] bg-white"
                        : "border-4 border-white shadow-xl ring-2 ring-gray-100"
                )}>
                    <AvatarImage src={displayPhoto} />
                    <AvatarFallback className={cn(
                        "text-4xl font-black",
                        isNeobrutalist
                            ? "bg-[#E63946] text-white"
                            : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                    )}>
                        {displayInitial}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 pt-16 md:pt-2">
                    <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h1 className="text-3xl font-heading font-black">{displayName}</h1>
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1",
                                isNeobrutalist
                                    ? "bg-yellow-300 border-2 border-black shadow-[2px_2px_0_0_#000]"
                                    : "bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200"
                            )}>
                                <img src={currentRank.icon} alt={rankName} className="h-6 w-6 object-contain" />
                                <span className="text-sm font-bold uppercase tracking-wide">{rankName}</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            {isDemo ? 'Modo Demonstração' : 'Oficial Ratel'}
                            <span className={cn(
                                "text-xs px-2 py-0.5 font-bold",
                                isNeobrutalist
                                    ? "bg-[#E63946] text-white border border-black"
                                    : "bg-primary/10 text-primary rounded-full"
                            )}>Nível {level}</span>
                        </p>

                        {/* XP Bar */}
                        <div className="mt-4 w-full max-w-md">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span>XP {currentXP}</span>
                                <span>{nextLevelXP} XP (Prox. Rank)</span>
                            </div>
                            <div className={cn(
                                "h-3 w-full overflow-hidden",
                                isNeobrutalist
                                    ? "bg-gray-200 border-2 border-black"
                                    : "bg-gray-200 rounded-full"
                            )}>
                                <div
                                    className={cn(
                                        "h-full transition-all duration-500",
                                        isNeobrutalist
                                            ? "bg-[#E63946]"
                                            : "bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                    )}
                                    style={{ width: `${xpProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Brasil
                        </div>
                        <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {displayEmail}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Membro desde Jan 2026
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0 mt-8">
                {/* Coluna Esquerda: Sobre e Stats */}
                <div className="space-y-6">
                    <Card className={cardClass}>
                        <CardHeader>
                            <CardTitle className="text-lg font-black">Sobre</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {isDemo
                                    ? 'Este é um perfil de demonstração. Faça login com Google ou Microsoft para ver seus dados reais.'
                                    : 'Gerenciando emails com inteligência usando o Ratel.'
                                }
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={cardClass}>
                        <CardHeader>
                            <CardTitle className="text-lg font-black">Estatísticas</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-black text-[#E63946]">127</p>
                                <p className="text-xs text-muted-foreground">Emails processados</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-black">89%</p>
                                <p className="text-xs text-muted-foreground">Inbox Zero</p>
                            </div>
                            <div className="text-center col-span-2 mt-2 pt-2 border-t-2 border-dashed border-gray-200">
                                <p className="text-xs font-bold text-muted-foreground mb-2">BASE OPERACIONAL</p>
                                <img
                                    src="/envato/50-gamification-isometric-icons-2024-02-26-22-32-46-utc/png/with shadows/Asset 123.png"
                                    alt="Base"
                                    className="h-20 w-20 mx-auto object-contain drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Direita: Configurações (antiga SettingsPage) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid gap-6">
                        {/* Perfil Público */}
                        <Card className={cardClass}>
                            <CardHeader>
                                <CardTitle className="font-black">Perfil Público</CardTitle>
                                <CardDescription>Como você aparece para outros usuários e contatos.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Nome de Exibição</label>
                                    <Input defaultValue={displayName} className={inputClass} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Email Principal</label>
                                    <div className="flex gap-2">
                                        <Input defaultValue={displayEmail} disabled className={inputClass} />
                                        {!isDemo && (
                                            <Button variant="outline" className={buttonClass}>Gerenciar</Button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Provedor de Login</label>
                                    <Input
                                        defaultValue={providerLabel}
                                        disabled
                                        className={inputClass}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estilo Visual */}
                        <Card className={cardClass}>
                            <CardHeader>
                                <CardTitle className="font-black">Estilo Visual</CardTitle>
                                <CardDescription>Escolha entre dois estilos de interface.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <StyleThemeSelector />
                            </CardContent>
                        </Card>

                        {/* Aparência */}
                        <Card className={cardClass}>
                            <CardHeader>
                                <CardTitle className="font-black">Outras Opções</CardTitle>
                                <CardDescription>Configurações adicionais de interface.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {/* Densidade */}
                                <div className="flex items-center justify-between relative">
                                    <div className="flex items-center gap-3">
                                        <Monitor className="h-5 w-5" />
                                        <div>
                                            <p className="text-sm font-medium">Densidade</p>
                                            <p className="text-sm text-muted-foreground">{densityLabels[density]}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={buttonClass}
                                            onClick={() => setShowDensityMenu(!showDensityMenu)}
                                        >
                                            Alterar
                                        </Button>
                                        {showDensityMenu && (
                                            <div className={cn(
                                                "absolute right-0 top-full mt-2 w-40 py-1 z-50",
                                                isNeobrutalist
                                                    ? "bg-white border-2 border-black shadow-[4px_4px_0_0_#000]"
                                                    : "bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl"
                                            )}>
                                                {(['compact', 'comfortable', 'spacious'] as const).map(d => (
                                                    <button
                                                        key={d}
                                                        onClick={() => { setDensity(d); setShowDensityMenu(false); }}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors",
                                                            density === d && "font-bold bg-gray-50"
                                                        )}
                                                    >
                                                        {densityLabels[d]}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tamanho da Fonte */}
                                <div className="flex items-center justify-between relative">
                                    <div className="flex items-center gap-3">
                                        <Type className="h-5 w-5" />
                                        <div>
                                            <p className="text-sm font-medium">Tamanho da Fonte</p>
                                            <p className="text-sm text-muted-foreground">{fontLabels[fontSize]}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={buttonClass}
                                            onClick={() => setShowFontMenu(!showFontMenu)}
                                        >
                                            Alterar
                                        </Button>
                                        {showFontMenu && (
                                            <div className={cn(
                                                "absolute right-0 top-full mt-2 w-44 py-1 z-50",
                                                isNeobrutalist
                                                    ? "bg-white border-2 border-black shadow-[4px_4px_0_0_#000]"
                                                    : "bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl"
                                            )}>
                                                {(['small', 'medium', 'large'] as const).map(f => (
                                                    <button
                                                        key={f}
                                                        onClick={() => { setFontSize(f); setShowFontMenu(false); }}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors",
                                                            fontSize === f && "font-bold bg-gray-50"
                                                        )}
                                                    >
                                                        {fontLabels[f]}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Idioma */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Languages className="h-5 w-5" />
                                        <div>
                                            <p className="text-sm font-medium">Idioma</p>
                                            <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className={buttonClass}>Alterar</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conta */}
                        <Card className={cardClass}>
                            <CardHeader>
                                <CardTitle className="font-black">Conta</CardTitle>
                                <CardDescription>Gerencie sua conta e dados.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className={cn("w-full justify-start", buttonClass)}>
                                    Exportar meus dados
                                </Button>
                                <Button
                                    variant="destructive"
                                    className={cn(
                                        "w-full justify-start font-bold",
                                        isNeobrutalist
                                            ? "border-4 border-black shadow-[4px_4px_0_0_#000] bg-[#E63946]"
                                            : "bg-red-500 hover:bg-red-600 rounded-lg"
                                    )}
                                >
                                    Excluir conta permanentemente
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
