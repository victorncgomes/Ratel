import { useState, useEffect } from 'react';
import { useDeepCleaning, DeepCleaningEmail } from '../../hooks/useDeepCleaning';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
import { Loader2, HardDrive, Calendar, Info } from 'lucide-react';
import { showToast } from '../../lib/toast';
import { authFetch } from '../../lib/api';

type ViewMode = 'size' | 'date';

export function DeepCleaning() {
    const { loading, error, fetchBySize, fetchByDate } = useDeepCleaning();
    const [viewMode, setViewMode] = useState<ViewMode>('size');
    const [emails, setEmails] = useState<DeepCleaningEmail[]>([]);
    const [totalSize, setTotalSize] = useState('0 MB');
    const [selectedEmailIds, setSelectedEmailIds] = useState<Set<string>>(new Set());
    const [actionLoading, setActionLoading] = useState(false);
    const [minSizeMB, setMinSizeMB] = useState(5);
    const [beforeDate, setBeforeDate] = useState(() => {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return oneYearAgo.toISOString().split('T')[0];
    });

    useEffect(() => {
        loadEmails();
    }, [viewMode, minSizeMB, beforeDate]);

    const loadEmails = async () => {
        try {
            let result;
            if (viewMode === 'size') {
                result = await fetchBySize(minSizeMB);
            } else {
                result = await fetchByDate(beforeDate);
            }
            setEmails(result.emails);
            setTotalSize(result.totalSize);
        } catch (err) {
            console.error('Erro ao carregar emails:', err);
        }
    };

    const handleDelete = async () => {
        if (selectedEmailIds.size === 0) return;
        setActionLoading(true);
        try {
            const emailIds = Array.from(selectedEmailIds);
            const response = await authFetch('/api/subscriptions/delete-all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailIds })
            });
            if (!response.ok) throw new Error('Erro ao deletar emails');
            showToast(`${emailIds.length} emails movidos para lixeira`, 'success');
            setSelectedEmailIds(new Set());
            loadEmails();
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSelectAll = () => {
        if (selectedEmailIds.size === emails.length) {
            setSelectedEmailIds(new Set());
        } else {
            setSelectedEmailIds(new Set(emails.map(e => e.id)));
        }
    };

    const handleSelectEmail = (id: string) => {
        const newSelected = new Set(selectedEmailIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedEmailIds(newSelected);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <HardDrive className="h-8 w-8 text-primary" />
                    Deep Cleaning
                </h2>
                <p className="text-muted-foreground mt-1 text-lg">
                    Encontre e remova emails grandes ou antigos para liberar espaço
                </p>
            </div>

            <div className="flex gap-2">
                <Button variant={viewMode === 'size' ? 'default' : 'outline'} onClick={() => setViewMode('size')} className="gap-2">
                    <HardDrive className="h-4 w-4" />
                    Por Tamanho
                </Button>
                <Button variant={viewMode === 'date' ? 'default' : 'outline'} onClick={() => setViewMode('date')} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Por Data
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {viewMode === 'size' ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tamanho mínimo: {minSizeMB} MB</label>
                            <input type="range" min="1" max="50" value={minSizeMB} onChange={(e) => setMinSizeMB(parseInt(e.target.value))} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>1 MB</span>
                                <span>50 MB</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Emails anteriores a:</label>
                            <Input type="date" value={beforeDate} onChange={(e) => setBeforeDate(e.target.value)} className="w-full" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">Total de Emails</div><div className="text-2xl font-bold">{emails.length}</div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">Espaço Total</div><div className="text-2xl font-bold">{totalSize}</div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="text-sm text-muted-foreground">Selecionados</div><div className="text-2xl font-bold">{selectedEmailIds.size}</div></CardContent></Card>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-600">
                    <Info className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p>Carregando emails...</p>
                </div>
            )}

            {!loading && emails.length > 0 && (
                <>
                    <BulkActionsToolbar selectedCount={selectedEmailIds.size} onDelete={handleDelete} onBlock={() => { }} onSpam={() => { }} loading={actionLoading} />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleSelectAll}>{selectedEmailIds.size === emails.length ? 'Desmarcar Todos' : 'Selecionar Todos'}</Button>
                    </div>
                    <div className="space-y-2">
                        {emails.map((email) => (
                            <Card key={email.id} className={`cursor-pointer transition-all ${selectedEmailIds.has(email.id) ? 'ring-2 ring-primary' : ''}`} onClick={() => handleSelectEmail(email.id)}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <input type="checkbox" checked={selectedEmailIds.has(email.id)} onChange={() => handleSelectEmail(email.id)} className="h-4 w-4" onClick={(e) => e.stopPropagation()} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{email.subject || '(Sem assunto)'}</p>
                                        <p className="text-sm text-muted-foreground truncate">{email.from}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(email.date).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{email.sizeFormatted}</Badge>
                                        {email.hasAttachment && <Badge variant="outline">📎</Badge>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {!loading && emails.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-secondary rounded-full mb-4">
                            {viewMode === 'size' ? <HardDrive className="h-8 w-8 text-muted-foreground" /> : <Calendar className="h-8 w-8 text-muted-foreground" />}
                        </div>
                        <h3 className="font-semibold text-xl">Nenhum email encontrado</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            {viewMode === 'size' ? `Não há emails maiores que ${minSizeMB} MB` : `Não há emails anteriores a ${new Date(beforeDate).toLocaleDateString('pt-BR')}`}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
