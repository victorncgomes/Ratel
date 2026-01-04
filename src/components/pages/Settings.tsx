import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Bell, Lock, Mail, Shield } from 'lucide-react';
import { Input } from '../ui/input';

export function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Perfil Público</CardTitle>
                        <CardDescription>Como você aparece para outros usuários e contatos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Nome de Exibição</label>
                            <Input defaultValue="Victor" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Email Principal</label>
                            <div className="flex gap-2">
                                <Input defaultValue="victor@outlook.com" disabled />
                                <Button variant="outline">Gerenciar</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preferências de Notificação</CardTitle>
                        <CardDescription>Escolha como você quer ser notificado.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-4">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium leading-none">Push Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receba alertas no desktop.</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativado</Badge>
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-4">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium leading-none">Emails de Resumo</p>
                                    <p className="text-sm text-muted-foreground">Resumo diário de atividades.</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-muted-foreground">Desativado</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Segurança</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button variant="outline" className="justify-start gap-3 h-auto py-3">
                            <Lock className="h-4 w-4" />
                            <div className="text-left">
                                <div className="font-medium">Alterar Senha</div>
                                <div className="text-xs text-muted-foreground">Última alteração há 3 meses</div>
                            </div>
                        </Button>
                        <Button variant="outline" className="justify-start gap-3 h-auto py-3">
                            <Shield className="h-4 w-4" />
                            <div className="text-left">
                                <div className="font-medium">Autenticação em 2 Fatores (2FA)</div>
                                <div className="text-xs text-muted-foreground">Recomendado para maior segurança</div>
                            </div>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
