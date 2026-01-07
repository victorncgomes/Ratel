import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';

interface PrivacyPageProps {
    onBack: () => void;
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
                        <CardDescription>Última atualização: Janeiro 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Resumo Visual */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Não vendemos seus dados</p>
                                    <p className="text-xs text-muted-foreground">Seus dados são seus. Ponto.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Criptografia SSL</p>
                                    <p className="text-xs text-muted-foreground">Dados protegidos em trânsito</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Acesso mínimo</p>
                                    <p className="text-xs text-muted-foreground">Só acessamos o necessário</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Exclusão a qualquer momento</p>
                                    <p className="text-xs text-muted-foreground">Revogue acesso quando quiser</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-border" />

                        {/* Detalhes */}
                        <div className="space-y-4 text-sm">
                            <h3 className="text-lg font-semibold">O que coletamos</h3>
                            <p className="text-muted-foreground">
                                Coletamos apenas as informações necessárias para o funcionamento do serviço:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>Endereço de e-mail (para autenticação)</li>
                                <li>Metadados de e-mails (remetente, assunto, data)</li>
                                <li>Token de acesso OAuth (para operar em seu nome)</li>
                            </ul>

                            <h3 className="text-lg font-semibold">O que NÃO fazemos</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>Não armazenamos o conteúdo completo dos seus e-mails</li>
                                <li>Não vendemos, alugamos ou compartilhamos seus dados</li>
                                <li>Não usamos seus dados para publicidade</li>
                                <li>Não permitimos que terceiros acessem suas informações</li>
                            </ul>

                            <h3 className="text-lg font-semibold">Segurança</h3>
                            <p className="text-muted-foreground">
                                Utilizamos criptografia SSL para todas as comunicações e seguimos as melhores
                                práticas de segurança da indústria. Nosso acesso é limitado ao mínimo necessário
                                para fornecer o serviço.
                            </p>

                            <h3 className="text-lg font-semibold">Seus Direitos (LGPD/GDPR)</h3>
                            <p className="text-muted-foreground">
                                Você tem direito a:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>Acessar seus dados pessoais</li>
                                <li>Corrigir dados incorretos</li>
                                <li>Solicitar exclusão dos seus dados</li>
                                <li>Revogar o acesso a qualquer momento</li>
                            </ul>

                            <h3 className="text-lg font-semibold">Como revogar acesso</h3>
                            <p className="text-muted-foreground">
                                Para revogar o acesso do Ratel à sua conta:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li><strong>Google:</strong> Acesse myaccount.google.com → Segurança → Apps de terceiros</li>
                                <li><strong>Microsoft:</strong> Acesse account.microsoft.com → Privacidade → Apps conectados</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
