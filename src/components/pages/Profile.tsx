import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Mail, MapPin, Calendar } from 'lucide-react';

export function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cover Image */}
            <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl relative">
                <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm">
                    Editar Capa
                </Button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 -mt-16 flex flex-col md:flex-row items-end md:items-start gap-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">V</AvatarFallback>
                </Avatar>

                <div className="flex-1 pt-16 md:pt-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Victor</h1>
                            <p className="text-muted-foreground">Product Designer & Developer</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">Editar Perfil</Button>
                            <Button>Compartilhar</Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            São Paulo, Brasil
                        </div>
                        <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            victor@outlook.com
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Membro desde Jan 2024
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0 mt-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Sobre</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Apaixonado por criar interfaces de usuário incríveis e otimizar fluxos de trabalho.
                                Atualmente focado em melhorar a produtividade de emails com o Ratel.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'TypeScript', 'Tailwind', 'Design Systems', 'UX/UI'].map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold">Atividade Recente</h3>
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        EP
                                    </div>
                                    <div>
                                        <p className="font-medium">Email Processado</p>
                                        <p className="text-sm text-muted-foreground">Você arquivou 45 emails da categoria "Social" em tempo recorde.</p>
                                        <p className="text-xs text-muted-foreground mt-2">Há {i} horas</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
