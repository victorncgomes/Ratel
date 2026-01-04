import { Button } from '../ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/input';
import { Search, Book, MessageCircle, FileQuestion, Video } from 'lucide-react';

export function HelpPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4 py-8">
                <h2 className="text-4xl font-bold tracking-tight">Como podemos ajudar?</h2>
                <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Busque por artigos, tutoriais..." />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <Book className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>Documentação</CardTitle>
                        <CardDescription>Guias detalhados sobre todas as funcionalidades.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <Video className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>Tutoriais em Vídeo</CardTitle>
                        <CardDescription>Aprenda visualmente com nossos screencasts.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <FileQuestion className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>FAQ</CardTitle>
                        <CardDescription>Perguntas frequentes e resolução de problemas.</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <div className="pt-8 border-t">
                <h3 className="text-xl font-semibold mb-6">Artigos Populares</h3>
                <div className="grid gap-4">
                    {[
                        'Como configurar sua assinatura de email',
                        'Integrando com Calendário Google',
                        'Gerenciando múltiplas contas',
                        'Atalhos de teclado para produtividade máxima',
                        'Configurando filtros e regras automáticas'
                    ].map((article, i) => (
                        <Button key={i} variant="ghost" className="justify-start h-auto py-3 text-base font-normal">
                            <span className="mr-2 text-muted-foreground">📄</span>
                            {article}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Ainda precisa de ajuda?</h3>
                    <p className="text-muted-foreground">Nossa equipe de suporte está disponível 24/7 para você.</p>
                </div>
                <Button size="lg" className="gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Falar com Suporte
                </Button>
            </div>
        </div>
    );
}
