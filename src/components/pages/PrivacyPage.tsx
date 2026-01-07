import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, Shield, Lock, Eye, Trash2, Database, Globe, UserCheck } from 'lucide-react';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

interface PrivacyPageProps {
    onBack: () => void;
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
    const { isNeobrutalist } = useStyleTheme();
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>

                <Card className={`mb-6 ${isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none' : ''}`}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
                        <CardDescription>Última atualização: 07 de Janeiro de 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Resumo Visual */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className={`flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none bg-white' : ''}`}>
                                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Não vendemos seus dados</p>
                                    <p className="text-xs text-muted-foreground">Seus dados são seus. Ponto.</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none bg-white' : ''}`}>
                                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Criptografia SSL/TLS</p>
                                    <p className="text-xs text-muted-foreground">Dados protegidos em trânsito</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none bg-white' : ''}`}>
                                <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Acesso mínimo</p>
                                    <p className="text-xs text-muted-foreground">Só acessamos o necessário</p>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000] rounded-none bg-white' : ''}`}>
                                <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Exclusão garantida</p>
                                    <p className="text-xs text-muted-foreground">Revogue acesso quando quiser</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-border" />

                        {/* Conteúdo Detalhado */}
                        <div className="space-y-6 text-sm">

                            <section>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Database className="h-5 w-5" />
                                    1. Dados que Coletamos
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    O Ratel coleta apenas os dados estritamente necessários para o funcionamento do serviço:
                                </p>
                                <div className="mt-3 space-y-3">
                                    <div>
                                        <p className="font-medium">1.1 Dados de Identificação</p>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                            <li>Nome e endereço de e-mail (fornecidos pelo provedor OAuth)</li>
                                            <li>Foto de perfil (quando disponível)</li>
                                            <li>Identificador único da conta</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-medium">1.2 Dados de E-mail (Metadados)</p>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                            <li>Remetente e destinatário</li>
                                            <li>Assunto do e-mail</li>
                                            <li>Data e hora de envio/recebimento</li>
                                            <li>Tamanho da mensagem</li>
                                            <li>Labels/categorias aplicadas</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-medium">1.3 Tokens de Acesso</p>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                            <li>Token OAuth 2.0 para autenticação</li>
                                            <li>Refresh token para renovação de acesso</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    2. O que NÃO Fazemos
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    Comprometemo-nos expressamente a:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                                    <li><strong>NÃO</strong> armazenar o conteúdo completo (body) dos seus e-mails</li>
                                    <li><strong>NÃO</strong> vender, alugar ou comercializar seus dados pessoais</li>
                                    <li><strong>NÃO</strong> compartilhar informações com terceiros para fins de marketing</li>
                                    <li><strong>NÃO</strong> utilizar seus dados para criação de perfis publicitários</li>
                                    <li><strong>NÃO</strong> ler ou analisar o conteúdo de seus e-mails para fins não relacionados ao serviço</li>
                                    <li><strong>NÃO</strong> enviar e-mails em seu nome</li>
                                    <li><strong>NÃO</strong> permitir acesso de funcionários aos seus dados sem justificativa técnica</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold">3. Finalidade do Tratamento</h3>
                                <p className="text-muted-foreground mt-2">
                                    Utilizamos seus dados exclusivamente para:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                                    <li>Autenticar sua identidade e manter sua sessão</li>
                                    <li>Identificar e-mails de newsletters para gerenciamento de inscrições</li>
                                    <li>Categorizar e-mails por tipo (promoções, atualizações, etc.)</li>
                                    <li>Executar ações de limpeza solicitadas por você</li>
                                    <li>Calcular estatísticas de uso do seu armazenamento</li>
                                    <li>Melhorar a qualidade do serviço</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold">4. Compartilhamento de Dados</h3>
                                <p className="text-muted-foreground mt-2">
                                    Seus dados podem ser compartilhados apenas nas seguintes situações:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                                    <li><strong>Provedores de Infraestrutura:</strong> Serviços de hospedagem e banco de dados (Railway, Vercel)</li>
                                    <li><strong>Obrigação Legal:</strong> Quando exigido por lei, ordem judicial ou autoridade competente</li>
                                    <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
                                </ul>
                                <p className="text-muted-foreground mt-2">
                                    Todos os nossos fornecedores estão sujeitos a acordos de confidencialidade e processam dados apenas conforme nossas instruções.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    5. Segurança dos Dados
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    Implementamos medidas técnicas e organizacionais para proteger seus dados:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                                    <li>Criptografia SSL/TLS em todas as comunicações</li>
                                    <li>Tokens de acesso armazenados de forma criptografada</li>
                                    <li>Autenticação OAuth 2.0 seguindo padrões de segurança do Google e Microsoft</li>
                                    <li>Acesso restrito aos sistemas por pessoal autorizado</li>
                                    <li>Monitoramento contínuo para detecção de atividades suspeitas</li>
                                    <li>Backups regulares e segurança de infraestrutura</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold">6. Armazenamento e Retenção</h3>
                                <p className="text-muted-foreground mt-2">
                                    <strong>Localização:</strong> Nossos servidores estão localizados nos Estados Unidos (Railway/Vercel).
                                </p>
                                <p className="text-muted-foreground mt-2">
                                    <strong>Período de Retenção:</strong> Mantemos seus dados enquanto sua conta estiver ativa. Após a revogação
                                    do acesso ou solicitação de exclusão, seus dados serão removidos em até 30 dias.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <UserCheck className="h-5 w-5" />
                                    7. Seus Direitos (LGPD/GDPR)
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    Em conformidade com a Lei Geral de Proteção de Dados (LGPD) e o Regulamento Geral de Proteção de
                                    Dados (GDPR), você tem direito a:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                                    <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                                    <li><strong>Correção:</strong> Corrigir dados incompletos ou desatualizados</li>
                                    <li><strong>Anonimização/Bloqueio:</strong> Solicitar anonimização de dados desnecessários</li>
                                    <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                                    <li><strong>Eliminação:</strong> Solicitar exclusão de seus dados pessoais</li>
                                    <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
                                    <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
                                    <li><strong>Reclamação:</strong> Apresentar reclamação à ANPD (Brasil) ou autoridade competente</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold">8. Como Exercer Seus Direitos</h3>
                                <p className="text-muted-foreground mt-2">
                                    Para exercer qualquer um dos direitos acima:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                                    <li><strong>E-mail:</strong> Envie solicitação para privacidade@paranaue.dev</li>
                                    <li><strong>Revogação de Acesso:</strong></li>
                                </ul>
                                <ul className="list-none text-muted-foreground space-y-1 ml-8 mt-1">
                                    <li>• <strong>Google:</strong> myaccount.google.com → Segurança → Apps de terceiros</li>
                                    <li>• <strong>Microsoft:</strong> account.microsoft.com → Privacidade → Apps conectados</li>
                                </ul>
                                <p className="text-muted-foreground mt-2">
                                    Responderemos às solicitações em até 15 dias úteis.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    9. Cookies e Tecnologias Similares
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    Utilizamos cookies estritamente necessários para:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                                    <li>Manter sua sessão de autenticação</li>
                                    <li>Lembrar suas preferências de idioma e tema</li>
                                    <li>Garantir a segurança da aplicação</li>
                                </ul>
                                <p className="text-muted-foreground mt-2">
                                    Não utilizamos cookies de rastreamento ou publicidade.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold">10. Menores de Idade</h3>
                                <p className="text-muted-foreground mt-2">
                                    O Ratel não é destinado a menores de 18 anos. Não coletamos intencionalmente dados de menores.
                                    Se tomarmos conhecimento de que coletamos dados de um menor, tomaremos medidas imediatas para
                                    excluir tais informações.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold">11. Alterações nesta Política</h3>
                                <p className="text-muted-foreground mt-2">
                                    Podemos atualizar esta Política de Privacidade periodicamente. Alterações significativas serão
                                    comunicadas por e-mail ou aviso destacado na plataforma. A data da última atualização sempre
                                    estará indicada no topo deste documento.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold">12. Contato e Encarregado de Dados (DPO)</h3>
                                <p className="text-muted-foreground mt-2">
                                    Para dúvidas sobre esta Política ou sobre o tratamento de seus dados:
                                </p>
                                <ul className="list-none text-muted-foreground space-y-1 ml-4 mt-2">
                                    <li><strong>E-mail:</strong> privacidade@paranaue.dev</li>
                                    <li><strong>Empresa:</strong> Paranaue Tecnologia LTDA</li>
                                    <li><strong>Encarregado (DPO):</strong> Victor Gomes</li>
                                </ul>
                            </section>

                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
