
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { CheckCircle2, XCircle } from 'lucide-react';

const mockSubscriptions = [
    { name: 'Newsletter TechCrunch', email: 'news@techcrunch.com', freq: 'Semanal', status: 'Ativo', score: 95 },
    { name: 'Marketing Weekly', email: 'updates@marketing.com', freq: 'Diário', status: 'Risco', score: 45 },
    { name: 'Product Hunt Daily', email: 'hello@producthunt.com', freq: 'Diário', status: 'Ativo', score: 88 },
    { name: 'Dribbble Invites', email: 'invite@dribbble.com', freq: 'Mensal', status: 'Inativo', score: 20 },
    { name: 'Github Notifications', email: 'noreply@github.com', freq: 'Real-time', status: 'Ativo', score: 92 },
    { name: 'Amazon Deals', email: 'deals@amazon.com', freq: 'Diário', status: 'Spam Provável', score: 15 },
];

export function SubscriptionsPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inscrições</h2>
                    <p className="text-muted-foreground">Gerencie suas newsletters e listas de email.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Scanear Inbox</Button>
                    <Button>Desinscrever Selecionados</Button>
                </div>
            </div>

            <div className="grid gap-4">
                {mockSubscriptions.map((sub, i) => (
                    <Card key={i} className="group hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarFallback>{sub.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold group-hover:text-primary transition-colors">{sub.name}</h4>
                                    <p className="text-sm text-muted-foreground">{sub.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Frequência</p>
                                    <p className="text-sm font-medium">{sub.freq}</p>
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Health Score</p>
                                    <div className="flex items-center gap-1 justify-center">
                                        <span className={`text-sm font-bold ${sub.score > 70 ? 'text-green-600' : sub.score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {sub.score}
                                        </span>
                                    </div>
                                </div>

                                <Badge variant={sub.status === 'Ativo' ? 'default' : sub.status === 'Risco' ? 'secondary' : 'destructive'}>
                                    {sub.status}
                                </Badge>

                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="text-green-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-red-600 bg-red-50 hover:bg-red-100">
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
