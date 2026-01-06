import { useState, useEffect } from 'react';
import { Menu, Bell, Search, HelpCircle, LogOut, Settings } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { Button } from './components/ui/Button';

import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { cn } from './lib/utils';
import { LandingPage } from './components/LandingPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ProgressProvider } from './contexts/ProgressContext';

import { FlagBR, FlagES, FlagUK } from './components/icons/Flags';

// Pages
import { DashboardPage } from './components/pages/Dashboard';
import { HelpPage } from './components/pages/Help';
import { NotificationsPage } from './components/pages/Notifications';
import { ProfilePage } from './components/pages/Profile';
import { SubscriptionsPage } from './components/pages/Subscriptions';
import { ActivityPage } from './components/pages/Activity';
import { CleanupPage } from './components/pages/Cleanup';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { MailListView } from './components/pages/MailListView';
import { RulesPage } from './components/pages/RulesPage';

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
    const [userMenuOpen, setUserMenuOpen] = useState(false);

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
            <LandingPage
                onLogin={() => setIsAuthenticated(true)}
                onShowTerms={() => setShowLegalPage('terms')}
                onShowPrivacy={() => setShowLegalPage('privacy')}
            />
        );
    }

    const navItems = [
        { id: 'subscriptions', icon: '📬', label: t('sidebar.email_lists'), badge: String(12) },
        { id: 'cleanup', icon: '🧹', label: t('sidebar.quick_cleanup'), badge: null },
    ];

    const smartViews = [
        { id: 'by-sender', icon: '👤', label: t('sidebar.by_sender'), count: 156 },
        { id: 'by-size', icon: '📦', label: t('sidebar.by_size'), count: 34 },
        { id: 'by-date', icon: '📅', label: t('sidebar.by_date'), count: 89 },
        { id: 'newsletters', icon: '📰', label: t('sidebar.newsletters'), count: 45 },
        { id: 'promotions', icon: '🛒', label: t('sidebar.promotions'), count: 78 },
    ];

    const actionItems = [
        { id: 'shield', icon: '🛡️', label: t('sidebar.shield'), count: 3 },
        { id: 'rollup', icon: '📦', label: t('sidebar.rollup'), count: 5 },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardPage onNavigate={setActiveTab} />;
            case 'subscriptions': return <SubscriptionsPage />;
            case 'cleanup': return <CleanupPage />;
            case 'activity': return <ActivityPage />;
            case 'settings': return <ProfilePage user={user} />;
            case 'help': return <HelpPage />;
            case 'notifications': return <NotificationsPage />;
            case 'profile': return <ProfilePage user={user} />;
            case 'by-sender':
                return <MailListView viewType="by-sender" />;
            case 'by-size':
                return <MailListView viewType="by-size" />;
            case 'by-date':
                return <MailListView viewType="by-date" />;
            case 'newsletters':
                return <MailListView viewType="newsletters" />;
            case 'promotions':
                return <MailListView viewType="promotions" />;
            case 'shield':
                return <RulesPage type="shield" />;
            case 'rollup':
                return <RulesPage type="rollup" />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen gradient-bg font-sans antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full glass border-b border-white/10">
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

                    {/* Logo - aligned with sidebar menus */}
                    <div className="flex items-center gap-3 cursor-pointer ml-4" onClick={() => setActiveTab('dashboard')}>
                        <img
                            src="/name-ratel.svg?v=3"
                            alt="Ratel"
                            className="h-8 object-contain"
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
                    'fixed top-16 left-0 bottom-0 w-64 glass border-r border-white/10 transition-transform duration-300 z-40 flex flex-col',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <nav className="flex flex-col h-full p-4 gap-2 overflow-y-auto">
                    {/* Main Actions */}
                    <div className="space-y-1">
                        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('sidebar.main_actions')}</p>
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
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <Badge variant={isActive ? 'secondary' : 'outline'}>{item.badge}</Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Smart Views - Mailstrom Style */}
                    <div className="space-y-1 pt-4 border-t border-border/50">
                        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('sidebar.smart_views')}</p>
                        {smartViews.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                    activeTab === item.id
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                )}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span className="flex-1 text-left">{item.label}</span>
                                <span className="text-xs text-muted-foreground">{item.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Shield & Rollup - Leave Me Alone Style */}
                    <div className="space-y-1 pt-4 border-t border-border/50">
                        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('sidebar.protection')}</p>
                        {actionItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                    activeTab === item.id
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                )}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span className="flex-1 text-left">{item.label}</span>
                                <span className="text-xs text-muted-foreground">{item.count}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1" />

                    {/* User Profile Section */}
                    <div className="pt-4 border-t border-border/50">
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-secondary"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.photo || ''} />
                                    <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="font-medium truncate">{user?.name || t('user_menu.demo_user')}</p>
                                </div>
                            </button>

                            {/* User Submenu */}
                            {userMenuOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-normal hover:bg-muted transition-colors"
                                        style={{ fontStyle: 'normal' }}
                                        onClick={() => { setActiveTab('notifications'); setUserMenuOpen(false); }}
                                    >
                                        <Bell className="h-4 w-4" />
                                        <span style={{ fontStyle: 'normal' }}>{t('user_menu.notifications')}</span>
                                        <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px]">3</Badge>
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-normal hover:bg-muted transition-colors"
                                        style={{ fontStyle: 'normal' }}
                                        onClick={() => { setActiveTab('help'); setUserMenuOpen(false); }}
                                    >
                                        <HelpCircle className="h-4 w-4" />
                                        <span style={{ fontStyle: 'normal' }}>{t('user_menu.help')}</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-normal hover:bg-muted transition-colors"
                                        style={{ fontStyle: 'normal' }}
                                        onClick={() => { setActiveTab('profile'); setUserMenuOpen(false); }}
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span style={{ fontStyle: 'normal' }}>{t('user_menu.settings')}</span>
                                    </button>
                                    <hr className="my-1 border-border" />
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                        style={{ fontStyle: 'normal' }}
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span style={{ fontStyle: 'normal' }}>{t('user_menu.logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="pt-0 lg:pl-64 min-h-screen transition-all duration-300">
                <div className="p-6 max-w-7xl mx-auto space-y-6">
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
            <ProgressProvider>
                <RatelApp />
            </ProgressProvider>
        </LanguageProvider>
    );
}
