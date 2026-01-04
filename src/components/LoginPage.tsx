import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { ArrowRight, Loader2 } from 'lucide-react';

interface LoginPageProps {
    onLogin: () => void;
}

// ... (imports permanecem) ...

export function LoginPage({ onLogin }: LoginPageProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    // Verificar se retornou com erro via query params
    const searchParams = new URLSearchParams(window.location.search);
    const hasError = searchParams.get('error');

    const handleLogin = (provider: string) => {
        setIsLoading(provider);

        if (provider === 'demo') {
            // Demo continua sendo mockado localmente
            setTimeout(() => {
                setIsLoading(null);
                onLogin();
            }, 1000);
            return;
        }

        // Redirecionamento para Backend Real
        const backendUrl = 'http://localhost:3109';

        if (provider === 'google') {
            window.location.href = `${backendUrl}/auth/google`;
        } else if (provider === 'microsoft') {
            window.location.href = `${backendUrl}/auth/microsoft`;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="z-10 w-full max-w-md px-4">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-4">
                        <img
                            src="/ratel.svg"
                            alt="Ratel Logo"
                            className="h-16 w-16 object-contain drop-shadow-lg"
                        />
                        <img
                            src="/name-ratel.svg"
                            alt="Ratel"
                            className="h-11 object-contain"
                        />
                    </div>
                </div>

                {hasError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                        Erro ao realizar login. Tente novamente ou verifique suas credenciais.
                    </div>
                )}

                <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
                    <CardHeader className="space-y-1 text-center pb-8">
                        <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
                        <CardDescription className="text-base">
                            Escolha uma opção para entrar na plataforma
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full relative h-12 text-base hover:bg-slate-50 border-slate-200"
                            onClick={() => handleLogin('google')}
                            disabled={!!isLoading}
                        >
                            {/* ... (SVG Google permanece o mesmo) ... */}
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continuar com Google
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full relative h-12 text-base hover:bg-slate-50 border-slate-200"
                            onClick={() => handleLogin('microsoft')}
                            disabled={!!isLoading}
                        >
                            {/* ... (SVG Microsoft permanece o mesmo) ... */}
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 23 23">
                                <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                                <path fill="#f35325" d="M1 1h10v10H1z" />
                                <path fill="#81bc06" d="M12 1h10v10H12z" />
                                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                <path fill="#ffba08" d="M12 12h10v10H12z" />
                            </svg>
                            Continuar com Hotmail
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">ou</span>
                            </div>
                        </div>

                        <Button
                            variant="default"
                            size="lg"
                            className="w-full h-12 text-base bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-[1.02]"
                            onClick={() => handleLogin('demo')}
                            disabled={!!isLoading}
                        >
                            {isLoading === 'demo' ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Acessar Versão Demo
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    &copy; 2024 Ratel. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
