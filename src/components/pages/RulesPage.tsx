
import { useEffect } from 'react';
import { useRules } from '../../hooks/useRules';
import { PageHeader } from '../ui/PageHeader';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Shield, Package, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { showToast } from '../../lib/toast';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

interface Props {
    type: 'shield' | 'rollup';
}

export function RulesPage({ type }: Props) {
    const { rules, loading, error, fetchRules, removeRule } = useRules();
    const { isNeobrutalist } = useStyleTheme();

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

    const stats = [
        {
            label: 'Regras Ativas',
            value: filteredRules.length,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            label: 'Tipo',
            value: type === 'shield' ? 'Bloqueio' : 'Agrupamento',
            icon: type === 'shield' ? Shield : Package,
            color: type === 'shield' ? 'text-purple-600' : 'text-blue-600',
            bgColor: type === 'shield' ? 'bg-purple-100' : 'bg-blue-100'
        }
    ];

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
            <PageHeader
                title={type === 'shield' ? 'Shield (Bloqueados)' : 'Rollup (Agrupados)'}
                description={type === 'shield'
                    ? 'Gerencie remetentes bloqueados e proteja sua caixa de entrada.'
                    : 'Gerencie remetentes que são agrupados em resumos diários.'}
                stats={stats}
            />

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Rules Grid */}
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
                        <Card key={rule.sender} className={`overflow-hidden transition-all ${isNeobrutalist
                            ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1'
                            : 'hover:shadow-md'
                            }`}>
                            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${isNeobrutalist
                                        ? 'border-2 border-black shadow-[2px_2px_0_0_#000] font-bold'
                                        : ''
                                        } ${type === 'shield' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {type === 'shield' ? <Shield className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg break-all">{rule.sender}</p>
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
                                    size="sm"
                                    onClick={() => handleRemove(rule.sender)}
                                    className={`text-destructive hover:text-white hover:bg-destructive ${isNeobrutalist ? 'font-bold uppercase border-2 border-transparent hover:border-black' : ''}`}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remover
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
