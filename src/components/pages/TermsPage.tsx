import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

interface TermsPageProps {
    onBack: () => void;
}

export function TermsPage({ onBack }: TermsPageProps) {
    const { isNeobrutalist } = useStyleTheme();
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>

                <Card className={isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none' : ''}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Termos de Serviço</CardTitle>
                        <CardDescription>Última atualização: 07 de Janeiro de 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none space-y-6">

                        <section>
                            <h3 className="text-lg font-semibold">1. Definições</h3>
                            <p className="text-muted-foreground">
                                <strong>"Ratel"</strong> refere-se à plataforma de gerenciamento de e-mails desenvolvida pela Paranaue Tecnologia LTDA.
                                <br /><strong>"Usuário"</strong> refere-se a qualquer pessoa física ou jurídica que utiliza os serviços do Ratel.
                                <br /><strong>"Serviços"</strong> refere-se a todas as funcionalidades oferecidas pela plataforma Ratel.
                                <br /><strong>"Conta de E-mail"</strong> refere-se à conta Google ou Microsoft conectada ao Ratel.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">2. Aceitação dos Termos</h3>
                            <p className="text-muted-foreground">
                                Ao acessar e utilizar o Ratel, você declara que leu, compreendeu e concorda integralmente com estes Termos de Serviço.
                                A utilização dos Serviços implica a aceitação automática destes termos. Caso não concorde com qualquer disposição,
                                você deve cessar imediatamente o uso da plataforma.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">3. Descrição do Serviço</h3>
                            <p className="text-muted-foreground">
                                O Ratel é uma ferramenta de produtividade que oferece os seguintes serviços:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>Identificação e cancelamento de inscrições em newsletters</li>
                                <li>Limpeza automatizada de e-mails indesejados ou antigos</li>
                                <li>Classificação inteligente de e-mails por categorias</li>
                                <li>Bloqueio de remetentes indesejados (Blindagem Anti-spam)</li>
                                <li>Agrupamento de newsletters para leitura organizada (Rollup)</li>
                                <li>Análise de espaço de armazenamento ocupado</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">4. Requisitos de Acesso</h3>
                            <p className="text-muted-foreground">
                                Para utilizar o Ratel, você deve:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>Ter pelo menos 18 anos de idade ou ser menor legalmente emancipado</li>
                                <li>Possuir uma conta Google (Gmail) ou Microsoft (Outlook/Hotmail) válida</li>
                                <li>Autorizar o acesso OAuth aos seus e-mails conforme solicitado</li>
                                <li>Aceitar estes Termos de Serviço e nossa Política de Privacidade</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">5. Permissões e Acesso à Conta de E-mail</h3>
                            <p className="text-muted-foreground">
                                O Ratel solicita permissões específicas através do protocolo OAuth 2.0 para:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li><strong>Leitura de e-mails:</strong> Para analisar metadados (remetente, assunto, data)</li>
                                <li><strong>Modificação de e-mails:</strong> Para mover, arquivar ou excluir mensagens conforme sua solicitação</li>
                                <li><strong>Gerenciamento de labels/pastas:</strong> Para organizar seus e-mails</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                <strong>DECLARAMOS EXPRESSAMENTE:</strong>
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>NÃO armazenamos o conteúdo completo dos seus e-mails em nossos servidores</li>
                                <li>NÃO vendemos, alugamos ou compartilhamos seus dados com terceiros</li>
                                <li>NÃO enviamos e-mails em seu nome</li>
                                <li>NÃO utilizamos seus dados para fins publicitários</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">6. Responsabilidades do Usuário</h3>
                            <p className="text-muted-foreground">O Usuário se compromete a:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>Utilizar o Ratel apenas para fins lícitos e em conformidade com estes Termos</li>
                                <li>Não utilizar o serviço para atividades fraudulentas, ilegais ou que violem direitos de terceiros</li>
                                <li>Manter a segurança de suas credenciais de acesso</li>
                                <li>Revisar os e-mails antes de confirmar exclusões em massa</li>
                                <li>Comunicar imediatamente qualquer uso não autorizado de sua conta</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">7. Propriedade Intelectual</h3>
                            <p className="text-muted-foreground">
                                Todos os direitos de propriedade intelectual relacionados ao Ratel, incluindo mas não limitado a software,
                                design, logotipos, textos e gráficos, são de propriedade exclusiva da Paranaue Tecnologia LTDA ou de seus
                                licenciadores. O uso do serviço não concede ao Usuário qualquer direito de propriedade sobre esses elementos.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">8. Limitação de Responsabilidade</h3>
                            <p className="text-muted-foreground">
                                O Ratel é fornecido "como está" (as is) e "conforme disponível" (as available). Não garantimos:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>Que o serviço será ininterrupto ou livre de erros</li>
                                <li>Que os resultados obtidos serão precisos ou confiáveis</li>
                                <li>Que quaisquer defeitos serão corrigidos</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                Em nenhuma hipótese seremos responsáveis por danos indiretos, incidentais, especiais, consequenciais ou
                                punitivos, incluindo perda de dados, lucros cessantes ou interrupção de negócios.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">9. Exclusão de E-mails</h3>
                            <p className="text-muted-foreground">
                                O Usuário reconhece que a exclusão de e-mails realizada através do Ratel é de sua inteira responsabilidade.
                                E-mails excluídos podem não ser recuperáveis. Recomendamos:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li>Revisar cuidadosamente antes de confirmar exclusões em massa</li>
                                <li>Utilizar a função "Lixeira" do seu provedor de e-mail quando possível</li>
                                <li>Manter backups de e-mails importantes</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">10. Cancelamento e Revogação de Acesso</h3>
                            <p className="text-muted-foreground">
                                Você pode revogar o acesso do Ratel à sua conta de e-mail a qualquer momento:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                <li><strong>Google:</strong> Acesse myaccount.google.com → Segurança → Apps de terceiros com acesso à conta</li>
                                <li><strong>Microsoft:</strong> Acesse account.microsoft.com → Privacidade → Apps e serviços</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                Após a revogação, excluiremos seus dados de nossos servidores em até 30 dias.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">11. Alterações nos Termos</h3>
                            <p className="text-muted-foreground">
                                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alterações significativas serão
                                comunicadas por e-mail ou através de aviso na plataforma. O uso continuado do serviço após as alterações
                                constitui aceitação dos novos termos.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">12. Lei Aplicável e Foro</h3>
                            <p className="text-muted-foreground">
                                Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de
                                São Paulo/SP para dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia expressa a
                                qualquer outro, por mais privilegiado que seja.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold">13. Contato</h3>
                            <p className="text-muted-foreground">
                                Para dúvidas sobre estes Termos de Serviço, entre em contato:
                            </p>
                            <ul className="list-none text-muted-foreground space-y-1 ml-4">
                                <li><strong>E-mail:</strong> contato@paranaue.dev</li>
                                <li><strong>Empresa:</strong> Paranaue Tecnologia LTDA</li>
                            </ul>
                        </section>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
