import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
    onBack: () => void;
}

export function TermsPage({ onBack }: TermsPageProps) {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Termos de Uso</CardTitle>
                        <CardDescription>Última atualização: Janeiro 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none space-y-4">
                        <h3 className="text-lg font-semibold">1. Aceitação dos Termos</h3>
                        <p className="text-muted-foreground">
                            Ao acessar e usar o Ratel, você concorda com estes Termos de Uso.
                            Se você não concordar com qualquer parte destes termos, não poderá usar nosso serviço.
                        </p>

                        <h3 className="text-lg font-semibold">2. Descrição do Serviço</h3>
                        <p className="text-muted-foreground">
                            O Ratel é uma ferramenta de gerenciamento de e-mails que ajuda você a:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            <li>Identificar e cancelar inscrições de newsletters indesejadas</li>
                            <li>Limpar sua caixa de entrada de forma eficiente</li>
                            <li>Organizar e-mails por categorias</li>
                            <li>Remover e-mails antigos e desnecessários</li>
                        </ul>

                        <h3 className="text-lg font-semibold">3. Acesso à Conta de E-mail</h3>
                        <p className="text-muted-foreground">
                            Para funcionar, o Ratel precisa de acesso somente leitura e modificação à sua conta de e-mail.
                            Nós <strong>NUNCA</strong>:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            <li>Vendemos seus dados para terceiros</li>
                            <li>Armazenamos o conteúdo completo dos seus e-mails</li>
                            <li>Compartilhamos informações pessoais</li>
                            <li>Enviamos e-mails em seu nome</li>
                        </ul>

                        <h3 className="text-lg font-semibold">4. Uso Aceitável</h3>
                        <p className="text-muted-foreground">
                            Você concorda em usar o Ratel apenas para fins legais e de acordo com estes termos.
                            É proibido usar o serviço para atividades ilegais ou prejudiciais.
                        </p>

                        <h3 className="text-lg font-semibold">5. Limitação de Responsabilidade</h3>
                        <p className="text-muted-foreground">
                            O Ratel é fornecido "como está". Não garantimos que o serviço será ininterrupto ou livre de erros.
                            Não somos responsáveis por e-mails deletados ou ações realizadas por você através do serviço.
                        </p>

                        <h3 className="text-lg font-semibold">6. Cancelamento</h3>
                        <p className="text-muted-foreground">
                            Você pode revogar o acesso do Ratel à sua conta de e-mail a qualquer momento
                            através das configurações de segurança do seu provedor de e-mail (Google/Microsoft).
                        </p>

                        <h3 className="text-lg font-semibold">7. Contato</h3>
                        <p className="text-muted-foreground">
                            Para dúvidas sobre estes termos, entre em contato conosco.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
