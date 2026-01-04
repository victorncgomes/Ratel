import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Mail, MapPin, Calendar, Palette, Monitor, Languages } from 'lucide-react';

interface ProfileProps {
    user?: {
        name: string;
        email: string;
        photo: string;
        provider: string;
    } | null;
}

export function ProfilePage({ user }: ProfileProps) {
    const isDemo = !user || user.provider === 'demo';
    const displayName = isDemo ? 'Usuário Demo' : user?.name || 'Usuário';
    const displayEmail = isDemo ? 'demo@ratel.app' : user?.email || '';
    const displayInitial = displayName.charAt(0).toUpperCase();
    const displayPhoto = isDemo ? '' : user?.photo || '';
    const providerLabel = isDemo ? 'Demo' : user?.provider === 'google' ? 'Google' : 'Microsoft';

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cover Image */}
            <div className="h-48 w-full bg-gradient-to-r from-primary to-fluent-purple rounded-t-2xl relative">
                <Badge className="absolute top-4 left-4 bg-white/20 text-white border-none">
                    Conectado via {providerLabel}
                </Badge>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 -mt-16 flex flex-col md:flex-row items-end md:items-start gap-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src={displayPhoto} />
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                        {displayInitial}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 pt-16 md:pt-2">
                    <div>
                        <h1 className="text-3xl font-heading font-bold">{displayName}</h1>
                        <p className="text-muted-foreground">
                            {isDemo ? 'Modo Demonstração' : 'Usuário Ratel'}
                        </p>
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Sobre</CardTitle>
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

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Estatísticas</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-fluent-blue">127</p>
                                <p className="text-xs text-muted-foreground">Emails processados</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-fluent-green">89%</p>
                                <p className="text-xs text-muted-foreground">Inbox Zero</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Direita: Configurações (antiga SettingsPage) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid gap-6">
                        {/* Perfil Público */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Perfil Público</CardTitle>
                                <CardDescription>Como você aparece para outros usuários e contatos.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Nome de Exibição</label>
                                    <Input defaultValue={displayName} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Email Principal</label>
                                    <div className="flex gap-2">
                                        <Input defaultValue={displayEmail} disabled />
                                        {!isDemo && (
                                            <Button variant="outline">Gerenciar</Button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Provedor de Login</label>
                                    <Input
                                        value={providerLabel}
                                        disabled
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Aparência */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Aparência</CardTitle>
                                <CardDescription>Personalize a interface do Ratel.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Palette className="h-5 w-5 text-fluent-purple" />
                                        <div>
                                            <p className="text-sm font-medium">Tema</p>
                                            <p className="text-sm text-muted-foreground">Modo claro ativado</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Alterar</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Monitor className="h-5 w-5 text-fluent-blue" />
                                        <div>
                                            <p className="text-sm font-medium">Densidade</p>
                                            <p className="text-sm text-muted-foreground">Compacta</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Alterar</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Languages className="h-5 w-5 text-fluent-teal" />
                                        <div>
                                            <p className="text-sm font-medium">Idioma</p>
                                            <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Alterar</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conta */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Conta</CardTitle>
                                <CardDescription>Gerencie sua conta e dados.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start text-fluent-orange">
                                    Exportar meus dados
                                </Button>
                                <Button variant="destructive" className="w-full justify-start">
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
