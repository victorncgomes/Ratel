import { useState } from 'react';
import { Menu, Bell, Search, Mail, Inbox, Tag, Activity, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { Button } from './components/ui/Button';
import { Card, CardContent } from './components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { cn } from './lib/utils';
import { LoginPage } from './components/LoginPage';

// Pages
import { DashboardPage } from './components/pages/Dashboard';
import { SettingsPage } from './components/pages/Settings';
import { HelpPage } from './components/pages/Help';
import { NotificationsPage } from './components/pages/Notifications';
import { ProfilePage } from './components/pages/Profile';
import { SubscriptionsPage } from './components/pages/Subscriptions';
import { LabelsPage } from './components/pages/Labels';
import { ActivityPage } from './components/pages/Activity';

function App() {
    useTheme(); // Inicializa tema
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!isAuthenticated) {
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

    const navItems = [
        { id: 'dashboard', icon: Inbox, label: 'Dashboard', badge: null },
        { id: 'subscriptions', icon: Mail, label: 'Inscrições', badge: '12' },
        { id: 'labels', icon: Tag, label: 'Labels', badge: null },
        { id: 'activity', icon: Activity, label: 'Atividade', badge: null },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardPage />;
            case 'subscriptions': return <SubscriptionsPage />;
            case 'labels': return <LabelsPage />;
            case 'activity': return <ActivityPage />;
            case 'settings': return <SettingsPage />;
            case 'help': return <HelpPage />;
            case 'notifications': return <NotificationsPage />;
            case 'profile': return <ProfilePage />;
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
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                            <Mail className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:inline-block">Ratel</span>
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 transition-all duration-300 focus-within:max-w-lg">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="text"
                                placeholder="Pesquisar emails, contatos ou labels... (Ctrl+K)"
                                className="pl-10 w-full bg-secondary/50 border-transparent focus:bg-background focus:border-input transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative hover:bg-secondary/80"
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Bell className={`h - 5 w - 5 ${activeTab === 'notifications' ? 'text-primary fill-primary' : ''} `} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                        </Button>

                        <div
                            className="cursor-pointer"
                            onClick={() => setActiveTab('profile')}
                        >
                            <Avatar className="h-8 w-8 hover:ring-2 ring-primary ring-offset-2 transition-all">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground text-sm font-semibold">
                                    V
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-16 left-0 bottom-0 w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 z-40',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <nav className="flex flex-col h-full p-4 gap-2">
                    <div className="space-y-1 flex-1">
                        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Menu Principal</p>
                        {navItems.map((item) => {
                            const Icon = item.icon;
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
                                    <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive && "scale-105")} />
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
                        <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Suporte</p>
                        <Button
                            variant="ghost"
                            className={cn("w-full justify-start gap-3 px-3", activeTab === 'settings' && "bg-secondary")}
                            onClick={() => setActiveTab('settings')}
                        >
                            <Settings className="h-4 w-4" />
                            Configurações
                        </Button>
                        <Button
                            variant="ghost"
                            className={cn("w-full justify-start gap-3 px-3", activeTab === 'help' && "bg-secondary")}
                            onClick={() => setActiveTab('help')}
                        >
                            <HelpCircle className="h-4 w-4" />
                            Ajuda
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => setIsAuthenticated(false)}
                        >
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>

                        {/* Storage Card */}
                        <Card className="mt-4 bg-secondary/30 border-none shadow-inner">
                            <CardContent className="p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-semibold text-foreground">
                                        Armazenamento
                                    </p>
                                    <span className="text-[10px] text-muted-foreground">78%</span>
                                </div>
                                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-primary w-[78%] rounded-full" />
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground">11.7 GB de 15 GB</p>
                            </CardContent>
                        </Card>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="pt-16 lg:pl-64 min-h-screen transition-all duration-300">
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

export default App;
