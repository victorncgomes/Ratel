import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../ui/PageHeader';
import { useEmails, Email } from '../../hooks/useEmails';
import { Card } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Star, AlertCircle, Loader2, Trash2, Check } from 'lucide-react';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/Button';
import { showToast } from '../../lib/toast';

export function ImportantesView() {
    const { emails, loading, updateEmail, trashEmail, analyzeEmailsWithAI } = useEmails();
    const { isNeobrutalist } = useStyleTheme();
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Filter only important emails
    const importantEmails = useMemo(() => {
        return emails.filter(e => e.isImportant || (e.aiScore && e.aiScore > 75)).sort((a, b) =>
            (b.aiScore || 0) - (a.aiScore || 0)
        );
    }, [emails]);

    // Trigger Analysis for emails without score
    useEffect(() => {
        const unanalyzed = emails.slice(0, 10).filter(e => e.aiScore === undefined);
        if (unanalyzed.length > 0 && !isAnalyzing && analyzeEmailsWithAI) {
            setIsAnalyzing(true);
            analyzeEmailsWithAI(unanalyzed).finally(() => setIsAnalyzing(false));
        }
    }, [emails, isAnalyzing, analyzeEmailsWithAI]);

    const stats = [
        {
            label: 'Importantes',
            value: importantEmails.length,
            icon: Star,
            color: 'text-amber-500',
            bgColor: 'bg-amber-100'
        },
        {
            label: 'Alta Prioridade (90+)',
            value: importantEmails.filter(e => (e.aiScore || 0) > 90).length,
            icon: AlertCircle,
            color: 'text-red-500',
            bgColor: 'bg-red-100'
        }
    ];

    const handleTrash = async () => {
        if (!selectedEmail) return;
        try {
            await trashEmail(selectedEmail.id);
            showToast('Email movido para a lixeira', 'success');
            setSelectedEmail(null);
        } catch (e) {
            showToast('Erro ao excluir email', 'error');
        }
    };

    const handleKeep = async () => {
        if (!selectedEmail) return;
        try {
            // "Manter" marks as safe and potentially unmarks as "Important" if purely triage, 
            // but for now let's just Mark Safe so it doesn't get blocked. 
            // The prompt said "removes them from purge lists".
            await updateEmail(selectedEmail.id, { isMarkedSafe: true });
            showToast('Email marcado como seguro', 'success');
            // We keep it in the list (don't set isImportant: false) unless requested otherwise
        } catch (e) {
            showToast('Erro ao atualizar email', 'error');
        }
    };

    const handleNotImportant = async () => {
        if (!selectedEmail) return;
        try {
            await updateEmail(selectedEmail.id, { isImportant: false });
            showToast('Marcado como não importante', 'success');
            setSelectedEmail(null);
        } catch (e) {
            showToast('Erro ao atualizar email', 'error');
        }
    }

    if (loading && emails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Analisando prioridades com IA...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
            <PageHeader
                title="Importantes"
                description="Emails que requerem sua atenção imediata, selecionados pela IA."
                stats={stats}
            />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left Column: List */}
                <Card className={`flex flex-col overflow-hidden ${isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000]' : 'shadow-md border-gray-200'}`}>
                    <div className="p-4 border-b bg-muted/30">
                        <h3 className="font-bold text-sm uppercase tracking-wide">Lista de Prioridades</h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="divide-y h-full">
                            {importantEmails.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    Nenhum email marcado como importante.
                                </div>
                            ) : (
                                importantEmails.map(email => (
                                    <div
                                        key={email.id}
                                        onClick={() => setSelectedEmail(email)}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 ${selectedEmail?.id === email.id ? 'bg-accent border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold truncate max-w-[70%]">{email.from}</span>
                                            <Badge className={
                                                (email.aiScore || 0) > 90 ? 'bg-red-500' : 'bg-amber-500'
                                            }>
                                                Score: {email.aiScore}
                                            </Badge>
                                        </div>
                                        <p className="font-medium text-sm text-foreground/90 truncate">{email.subject}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{email.snippet}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Right Column: Reasoning & Details */}
                <Card className={`flex flex-col overflow-hidden ${isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000]' : 'shadow-md border-gray-200'}`}>
                    <div className="p-4 border-b bg-muted/30">
                        <h3 className="font-bold text-sm uppercase tracking-wide">Análise & Detalhes</h3>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-6">
                            {selectedEmail ? (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    {/* AI Reasoning Box */}
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold">
                                            <Star className="h-4 w-4" />
                                            Motivo da Importância
                                        </div>
                                        <p className="text-amber-900 text-sm leading-relaxed">
                                            {selectedEmail.aiReason || "A IA detectou palavras-chave ou padrões de alta prioridade neste email, mas não forneceu um motivo específico."}
                                        </p>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold mb-2">{selectedEmail.subject}</h2>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <span className="font-medium text-foreground">{selectedEmail.from}</span>
                                            <span>•</span>
                                            <span>{new Date(selectedEmail.date).toLocaleString()}</span>
                                        </div>
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                            {/* Simple body display - ideally we clean/sanitize HTML */}
                                            <div dangerouslySetInnerHTML={{ __html: selectedEmail.snippet || "" }} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-4 border-t">
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleKeep}
                                                className={`flex-1 gap-2 ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000]' : 'bg-green-600 hover:bg-green-700'}`}
                                            >
                                                <Check className="h-4 w-4" />
                                                Manter (Seguro)
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleTrash}
                                                className={`flex-1 gap-2 ${isNeobrutalist ? 'border-2 border-black shadow-[2px_2px_0_0_#000]' : ''}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Excluir
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={handleNotImportant}
                                            className="w-full"
                                        >
                                            Não é imortante
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center min-h-[300px]">
                                    <Star className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="text-lg font-medium">Selecione um email</p>
                                    <p className="text-sm max-w-xs mx-auto">
                                        Clique em um item da lista à esquerda para ver por que a IA o considerou importante.
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
}
