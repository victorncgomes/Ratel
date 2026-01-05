import { useState, useEffect } from 'react';
import { Menu, Bell, Search, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { Button } from './components/ui/Button';

import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { cn } from './lib/utils';
import { LoginPage } from './components/LoginPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

import { FlagBR, FlagES, FlagUK } from './components/icons/Flags';

// Pages
import { DashboardPage } from './components/pages/Dashboard';
import { HelpPage } from './components/pages/Help';
import { NotificationsPage } from './components/pages/Notifications';
import { ProfilePage } from './components/pages/Profile';
import { SubscriptionsPage } from './components/pages/Subscriptions';
import { LabelsPage } from './components/pages/Labels';
import { ActivityPage } from './components/pages/Activity';
import { CleanupPage } from './components/pages/Cleanup';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';

interface UserData {
    name: string;
    email: string;
    photo: string;
    provider: string;
    accessToken?: string;
}

function RatelApp() {
    useTheme(); // Inicializa tema
    const { t, language, setLanguage } = useLanguage();
    const [isFlagMenuOpen, setIsFlagMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [user, setUser] = useState<UserData | null>(null);
    const [showLegalPage, setShowLegalPage] = useState<'terms' | 'privacy' | null>(null);

    // Verificar parâmetros de URL para login OAuth
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const authStatus = params.get('auth');
        const userData = params.get('user');

        if (authStatus === 'success' && userData) {
            try {
                const parsedUser = JSON.parse(decodeURIComponent(userData));
                setUser(parsedUser);
                setIsAuthenticated(true);
                // Limpa URL sem recarregar a página
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error('Erro ao parsear dados do usuário:', e);
            }
        }

        // Verifica localStorage para sessão persistida
        const storedUser = localStorage.getItem('ratel_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                localStorage.removeItem('ratel_user');
            }
        }
    }, []);

    // Persiste usuário no localStorage quando muda
    useEffect(() => {
        if (user) {
            localStorage.setItem('ratel_user', JSON.stringify(user));
        }
    }, [user]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('ratel_user');
    };

    if (showLegalPage === 'terms') {
        return <TermsPage onBack={() => setShowLegalPage(null)} />;
    }

    if (showLegalPage === 'privacy') {
        return <PrivacyPage onBack={() => setShowLegalPage(null)} />;
    }

    if (!isAuthenticated) {
        return (
            <LoginPage
                onLogin={() => setIsAuthenticated(true)}
                onShowTerms={() => setShowLegalPage('terms')}
                onShowPrivacy={() => setShowLegalPage('privacy')}
            />
        );
    }

    const navItems = [
        { id: 'dashboard', icon: '📊', label: t('menu.dashboard'), badge: null },
        { id: 'subscriptions', icon: '📬', label: t('menu.subscriptions'), badge: '12' },
        { id: 'cleanup', icon: '🧹', label: 'Limpeza', badge: 'NOVO' },
        { id: 'labels', icon: '🏷️', label: t('menu.labels'), badge: null },
        { id: 'activity', icon: '⚡', label: t('menu.activity'), badge: null },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardPage />;
            case 'subscriptions': return <SubscriptionsPage />;
            case 'labels': return <LabelsPage />;
            case 'cleanup': return <CleanupPage />;
            case 'activity': return <ActivityPage />;
            case 'settings': return <ProfilePage user={user} />;
            case 'help': return <HelpPage />;
            case 'notifications': return <NotificationsPage />;
            case 'profile': return <ProfilePage user={user} />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center px-4 gap-4">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                        <div className="flex items-center justify-center">
                            <img
                                src="/ratel.svg?v=2"
                                alt="Ratel Logo"
                                className="h-10 w-10 object-contain"
                            />
                        </div>
                        <img
                            src="/name-ratel.svg?v=2"
                            alt="Ratel"
                            className="h-7 object-contain"
                        />
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 transition-all duration-300 focus-within:max-w-lg">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="text"
                                placeholder={t('common.search_placeholder')}
                                className="pl-10 w-full bg-secondary/50 border-transparent focus:bg-background focus:border-input transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                        {/* Language Selector */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsFlagMenuOpen(!isFlagMenuOpen)}
                                className="w-10 h-10 p-0 hover:bg-muted/50"
                            >
                                {language === 'pt' && <FlagBR className="w-6 h-auto rounded-[2px] shadow-sm" />}
                                {language === 'es' && <FlagES className="w-6 h-auto rounded-[2px] shadow-sm" />}
                                {language === 'en' && <FlagUK className="w-6 h-auto rounded-[2px] shadow-sm" />}
                            </Button>

                            {isFlagMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-40 bg-popover border rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                    <button
                                        className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted transition-colors", language === 'pt' && "bg-muted/70 font-medium")}
                                        onClick={() => { setLanguage('pt'); setIsFlagMenuOpen(false); }}
                                    >
                                        <FlagBR className="w-5 h-auto rounded-[2px] shadow-sm" />
                                        <span>Português</span>
                                    </button>
                                    <button
                                        className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted transition-colors", language === 'es' && "bg-muted/70 font-medium")}
                                        onClick={() => { setLanguage('es'); setIsFlagMenuOpen(false); }}
                                    >
                                        <FlagES className="w-5 h-auto rounded-[2px] shadow-sm" />
                                        <span>Español</span>
                                    </button>
                                    <button
                                        className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted transition-colors", language === 'en' && "bg-muted/70 font-medium")}
                                        onClick={() => { setLanguage('en'); setIsFlagMenuOpen(false); }}
                                    >
                                        <FlagUK className="w-5 h-auto rounded-[2px] shadow-sm" />
                                        <span>English</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Empty as items moved to sidebar (Notifications/Profile) */}
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-16 left-0 bottom-0 w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 z-40 flex flex-col',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <nav className="flex flex-col h-full p-4 gap-2">
                    <div className="space-y-1 flex-1">
                        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('common.main_menu')}</p>
                        {navItems.map((item) => {
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    )}
                                >
                                    <span className={cn(
                                        "text-lg transition-transform group-hover:scale-110",
                                        isActive && "scale-105"
                                    )}>{item.icon}</span>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <Badge variant={isActive ? 'secondary' : 'outline'} className={cn(isActive && "bg-primary-foreground text-primary hover:bg-primary-foreground")}>
                                            {item.badge}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Bottom Section */}
                    <div className="pt-4 space-y-1 border-t border-border/50">
                        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('common.support')}</p>

                        <Button
                            variant="ghost"
                            className={cn("w-full justify-start gap-3 px-3", activeTab === 'notifications' && "bg-secondary")}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Bell className="h-4 w-4" />
                            {t('common.notifications')}
                            <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px]">3</Badge>
                        </Button>

                        <Button
                            variant="ghost"
                            className={cn("w-full justify-start gap-3 px-3", activeTab === 'help' && "bg-secondary")}
                            onClick={() => setActiveTab('help')}
                        >
                            <HelpCircle className="h-4 w-4" />
                            {t('common.help')}
                        </Button>

                        {/* User Profile Button */}
                        <div className="pt-2 mt-2 border-t border-border/30">
                            <Button
                                variant="ghost"
                                className={cn("w-full justify-start gap-3 px-2 h-auto py-2", activeTab === 'profile' && "bg-secondary")}
                                onClick={() => setActiveTab('profile')}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.photo || ''} />
                                    <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="text-left overflow-hidden">
                                    <p className="text-sm font-medium truncate w-[140px]">{user?.name || t('common.user')}</p>
                                    <p className="text-xs text-muted-foreground truncate w-[140px]">{user?.email || 'user@ratel.app'}</p>
                                </div>
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 mt-1"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                {t('common.logout')}
                            </Button>
                        </div>

                        {/* Storage Card Removed - Moved to Dashboard */}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="pt-0 lg:pl-64 min-h-screen transition-all duration-300">
                <div className="px-4 pt-4 max-w-7xl mx-auto space-y-6">
                    {renderContent()}
                </div>
            </main>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden animate-in fade-in"
                />
            )}
        </div>
    );
}

export default function App() {
    return (
        <LanguageProvider>
            <RatelApp />
        </LanguageProvider>
    );
}
