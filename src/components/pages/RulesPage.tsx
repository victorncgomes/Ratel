import { useEffect } from 'react';
import { useRules } from '../../hooks/useRules';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Shield, Package, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { showToast } from '../../lib/toast';

interface Props {
    type: 'shield' | 'rollup';
}

export function RulesPage({ type }: Props) {
    const { rules, loading, error, fetchRules, removeRule } = useRules();

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const filteredRules = rules.filter(r => r.type === type);

    const handleRemove = async (sender: string) => {
        try {
            await removeRule(sender);
            showToast('Regra removida com sucesso', 'success');
        } catch (err) {
            showToast('Erro ao remover regra', 'error');
        }
    };

    if (loading && rules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Carregando regras...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    {type === 'shield' ? <Shield className="h-8 w-8 text-purple-600" /> : <Package className="h-8 w-8 text-blue-600" />}
                    {type === 'shield' ? 'Shield (Bloqueados)' : 'Rollup (Agrupados)'}
                </h2>
                <p className="text-muted-foreground mt-1 text-lg">
                    {type === 'shield'
                        ? 'Estes remetentes são bloqueados antes de chegarem à sua caixa.'
                        : 'Emails destes remetentes são agrupados em um único resumo diário.'}
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {filteredRules.length === 0 ? (
                    <Card className="border-dashed flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-secondary rounded-full mb-4">
                            {type === 'shield' ? <Shield className="h-8 w-8 text-muted-foreground" /> : <Package className="h-8 w-8 text-muted-foreground" />}
                        </div>
                        <h3 className="font-semibold text-xl">Nenhuma regra encontrada</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            Você ainda não adicionou nenhum remetente ao {type === 'shield' ? 'Shield' : 'Rollup'}.
                        </p>
                    </Card>
                ) : (
                    filteredRules.map((rule) => (
                        <Card key={rule.sender} className="overflow-hidden hover:shadow-md transition-all">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${type === 'shield' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {type === 'shield' ? <Shield className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{rule.sender}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-xs">
                                                Ativo
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                Adicionado em {new Date(rule.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleRemove(rule.sender)}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
