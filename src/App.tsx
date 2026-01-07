import { useState, useEffect, lazy, Suspense } from 'react';
import {
    Menu, Bell, Search, HelpCircle, LogOut, Settings,
    Mail, Trash2, User, HardDrive, Calendar, Newspaper, Tag,
    Shield, Package
} from 'lucide-react';
import { useProgress } from './contexts/ProgressContext';
import { useTheme } from './hooks/useTheme';
import { Button } from './components/ui/Button';

import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { cn } from './lib/utils';
import { LandingPage } from './components/LandingPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { StyleThemeProvider, useStyleTheme } from './contexts/StyleThemeContext';
import { MapView } from './components/gamification';

import { FlagBR, FlagES, FlagUK } from './components/icons/Flags';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('./components/pages/Dashboard').then(m => ({ default: m.DashboardPage })));
const HelpPage = lazy(() => import('./components/pages/Help').then(m => ({ default: m.HelpPage })));
const NotificationsPage = lazy(() => import('./components/pages/Notifications').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('./components/pages/Profile').then(m => ({ default: m.ProfilePage })));
const SubscriptionsPage = lazy(() => import('./components/pages/Subscriptions').then(m => ({ default: m.SubscriptionsPage })));
const ActivityPage = lazy(() => import('./components/pages/Activity').then(m => ({ default: m.ActivityPage })));
const CleanupPage = lazy(() => import('./components/pages/Cleanup').then(m => ({ default: m.CleanupPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const MailListView = lazy(() => import('./components/pages/MailListView').then(m => ({ default: m.MailListView })));
const RulesPage = lazy(() => import('./components/pages/RulesPage').then(m => ({ default: m.RulesPage })));
const ProcessingScreen = lazy(() => import('./components/ProcessingScreen').then(m => ({ default: m.ProcessingScreen })));
const DeepCleaning = lazy(() => import('./components/pages/DeepCleaning').then(m => ({ default: m.DeepCleaning })));

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
    const { isNeobrutalist } = useStyleTheme();
    const { isLoading: isGlobalLoading } = useProgress();
    const [isFlagMenuOpen, setIsFlagMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [user, setUser] = useState<UserData | null>(null);
    const [showLegalPage, setShowLegalPage] = useState<'terms' | 'privacy' | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);

    // Verificar parâmetros de URL para login OAuth
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const authStatus = params.get('auth');
        const userData = params.get('user');

        if (authStatus === 'success' && userData) {
            try {
                const parsedUser = JSON.parse(decodeURIComponent(userData));
                setUser(parsedUser);
                setShowProcessing(true); // Mostrar tela de processamento
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

    // Show processing screen if global loading is active or initial processing
    if (showProcessing || isGlobalLoading) {
        return (
            <ProcessingScreen
                onComplete={() => {
                    setShowProcessing(false);
                    setIsAuthenticated(true);
                }}
            />
        );
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
        { id: 'subscriptions', icon: Mail, label: 'Listas', badge: String(12) },
        { id: 'cleanup', icon: Trash2, label: 'Limpeza', badge: null },
    ];

    const smartViews = [{ id: 'by-sender', label: t('sidebar.smart_views.by_sender'), icon: User, count: 12 },
    { id: 'by-size', label: t('sidebar.smart_views.by_size'), icon: HardDrive, count: 5 },
    { id: 'by-date', label: t('sidebar.smart_views.by_date'), icon: Calendar, count: '' },
    { id: 'newsletters', label: t('sidebar.smart_views.newsletters'), icon: Newspaper, count: 42 },
    { id: 'promotions', icon: Tag, label: t('sidebar.promotions'), count: 78 },
    ];

    const actionItems = [
        { id: 'shield', icon: Shield, label: t('sidebar.shield'), count: 3 },
        { id: 'rollup', icon: Package, label: t('sidebar.rollup'), count: 5 },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return isNeobrutalist ? <MapView /> : <DashboardPage onNavigate={setActiveTab} />;
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
            case 'deep-cleaning':
                return <DeepCleaning />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            {/* Header - Theme Aware */}
            <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isNeobrutalist
                ? 'bg-white border-b-4 border-black'
                : 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'
                }`}>
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
                    'fixed top-16 left-0 bottom-0 w-64 transition-transform duration-300 z-40 flex flex-col',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                    isNeobrutalist
                        ? 'bg-white border-r-4 border-black'
                        : 'bg-slate-50 border-r border-slate-200'
                )}
            >
                <nav className="flex flex-col h-full p-4 gap-2 overflow-y-auto">
                    {/* Main Actions */}
                    <div className={`space-y-1 p-3 ${isNeobrutalist
                        ? 'border-4 border-black shadow-[4px_4px_0_0_#000] bg-white'
                        : ''
                        }`}>
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
                                        'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 group relative',
                                        isNeobrutalist
                                            ? `font-bold border-2 border-black ${isActive ? 'bg-[#E63946] text-white shadow-[3px_3px_0_0_#000]' : 'bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0_0_#000]'}`
                                            : `font-medium rounded-lg ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <Badge variant={isActive ? 'secondary' : 'outline'}>{item.badge}</Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Smart Views */}
                    <div className={`space-y-1 pt-4 mt-4 ${isNeobrutalist
                        ? 'border-4 border-black p-3 shadow-[4px_4px_0_0_#000] bg-white'
                        : 'border-t border-slate-200'
                        }`}>
                        {smartViews.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2 text-sm transition-all',
                                    isNeobrutalist
                                        ? `font-bold border-2 border-black ${activeTab === item.id ? 'bg-[#E63946] text-white shadow-[2px_2px_0_0_#000]' : 'bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0_0_#000]'}`
                                        : `font-medium rounded-lg ${activeTab === item.id ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="flex-1 text-left">{item.label}</span>
                                <span className="text-xs text-muted-foreground">{item.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Shield & Rollup */}
                    <div className={`space-y-1 pt-4 mt-4 ${isNeobrutalist
                        ? 'border-4 border-black p-3 shadow-[4px_4px_0_0_#000] bg-white'
                        : 'border-t border-slate-200'
                        }`}>
                        {actionItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2 text-sm transition-all',
                                    isNeobrutalist
                                        ? `font-bold border-2 border-black ${activeTab === item.id ? 'bg-[#E63946] text-white shadow-[2px_2px_0_0_#000]' : 'bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0_0_#000]'}`
                                        : `font-medium rounded-lg ${activeTab === item.id ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="flex-1 text-left">{item.label}</span>
                                <span className="text-xs text-muted-foreground">{item.count}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1" />

                    {/* User Profile Section */}
                    <div className={`pt-4 mt-4 relative ${isNeobrutalist
                        ? 'border-4 border-black p-3 shadow-[4px_4px_0_0_#000] bg-white'
                        : 'border-t border-slate-200'
                        }`}>
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-secondary"
                        >
                            <Avatar className={`h-8 w-8 ${isNeobrutalist ? 'border-2 border-black' : ''}`}>
                                <AvatarImage src={user?.photo || ''} />
                                <AvatarFallback className={isNeobrutalist ? 'font-bold bg-[#E63946] text-white' : ''}>
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="font-medium truncate">{user?.name || t('user_menu.demo_user')}</p>
                            </div>
                        </button>

                        {/* User Submenu */}
                        {userMenuOpen && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-normal not-italic hover:bg-muted transition-colors"
                                    onClick={() => { setActiveTab('notifications'); setUserMenuOpen(false); }}
                                >
                                    <Bell className="h-4 w-4" />
                                    <span className="not-italic">{t('user_menu.notifications')}</span>
                                    <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px]">3</Badge>
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-normal not-italic hover:bg-muted transition-colors"
                                    onClick={() => { setActiveTab('help'); setUserMenuOpen(false); }}
                                >
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="not-italic">{t('user_menu.help')}</span>
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-normal not-italic hover:bg-muted transition-colors"
                                    onClick={() => { setActiveTab('profile'); setUserMenuOpen(false); }}
                                >
                                    <Settings className="h-4 w-4" />
                                    <span className="not-italic">{t('user_menu.settings')}</span>
                                </button>
                                <hr className="my-1 border-border" />
                                <button
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 not-italic hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="not-italic">{t('user_menu.logout')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="pt-0 lg:pl-64 min-h-screen transition-all duration-300">
                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    }>
                        {renderContent()}
                    </Suspense>
                </div>
            </main>

            {/* Mobile Overlay */}
            {
                sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden animate-in fade-in"
                    />
                )
            }
        </div >
    );
}

export default function App() {
    return (
        <LanguageProvider>
            <StyleThemeProvider>
                <ProgressProvider>
                    <RatelApp />
                </ProgressProvider>
            </StyleThemeProvider>
        </LanguageProvider>
    );
}
