import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLabels } from '../../hooks/useLabels';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import {
    Plus, MoreHorizontal, Sparkles, Brain, Loader2,
    Mail, ArrowRight, Check, X, RefreshCw, AlertCircle
} from 'lucide-react';
import { mockLabels, mockClassificationStats } from '../../lib/mockData';
import { getAccessToken } from '../../lib/api';

export function LabelsPage() {
    const { t } = useLanguage();
    const { labels: realLabels, stats: realStats, classifiedEmails, loading, error, classifyWithAI } = useLabels();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);

    // Detectar modo demo
    useEffect(() => {
        const hasToken = getAccessToken();
        setIsDemoMode(!hasToken);

        // Só carregar classificação se tiver token
        if (hasToken) {
            classifyWithAI(10).catch(console.error);
        }
    }, [classifyWithAI]);

    // Usar dados mockados ou reais
    const labels = isDemoMode ? mockLabels : realLabels;
    const stats = isDemoMode ? mockClassificationStats : realStats;

    const handleAnalyze = async () => {
        try {
            await classifyWithAI(20);
            setShowSuggestions(true);
        } catch (e) {
            console.error(e);
        }
    };

    // Se carregando pela primeira vez
    if (loading && labels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <Brain className="h-16 w-16 text-purple-500 mb-4 animate-pulse" />
                <p className="text-lg font-medium">Analisando seus emails com IA...</p>
                <p className="text-sm text-muted-foreground">Gemini está classificando seu conteúdo</p>
            </div>
        );
    }

    // Se erro
    if (error && labels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-lg font-medium">Erro na classificação</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => classifyWithAI(10)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar novamente
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold tracking-tight">{t('labels_page.title')}</h2>
                    <p className="text-muted-foreground">{t('labels_page.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleAnalyze} disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                        )}
                        {loading ? 'Analisando...' : t('labels_page.organize_with_ia')}
                    </Button>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t('labels_page.new_label')}
                    </Button>
                </div>
            </div>

            {/* AI Dashboard - DADOS REAIS */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Brain className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{t('labels_page.ia_card.title')}</CardTitle>
                            <CardDescription>
                                Powered by Google Gemini AI
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">
                                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stats?.unclassified || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">{t('labels_page.ia_card.unclassified')}</p>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                            <p className="text-3xl font-bold text-green-600">
                                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${stats?.avgConfidence || 0}%`}
                            </p>
                            <p className="text-sm text-muted-foreground">{t('labels_page.ia_card.accuracy')}</p>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                            <p className="text-3xl font-bold text-purple-600">
                                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : labels.length}
                            </p>
                            <p className="text-sm text-muted-foreground">{t('labels_page.ia_card.active_labels')}</p>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-lg">
                            <p className="text-3xl font-bold text-orange-500">
                                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stats?.totalClassified || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">{t('labels_page.ia_card.organized_today')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Suggestions */}
            {showSuggestions && classifiedEmails.length > 0 && (
                <Card className="border-green-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                                <CardTitle className="text-lg">Sugestões da IA (Gemini)</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowSuggestions(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardDescription>
                            Classificação automática baseada no conteúdo real dos emails.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {classifiedEmails.slice(0, 5).map((email, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg group">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-medium truncate">{email.subject || 'Sem assunto'}</p>
                                        <p className="text-sm text-muted-foreground truncate">{email.from}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    <Badge className="bg-purple-500">{email.classification?.suggestedLabel || 'Geral'}</Badge>
                                    <span className="text-sm text-muted-foreground">{email.classification?.confidence || 0}%</span>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:bg-green-100">
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600 hover:bg-red-100">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                            <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                                <Check className="h-4 w-4" />
                                Aplicar Todas
                            </Button>
                            <Button variant="outline" onClick={() => setShowSuggestions(false)}>
                                {t('common.cancel')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Labels Grid - DADOS REAIS */}
            <div>
                <h3 className="text-lg font-semibold mb-4">{t('labels_page.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {labels.map((label) => (
                        <Card key={label.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded ${label.color}`} />
                                    <span className="font-semibold text-lg">{label.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="text-xs">
                                        {label.count} emails
                                    </Badge>
                                    <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {labels.length === 0 && !loading && (
                        <Card className="col-span-full p-8 text-center">
                            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Nenhuma label detectada ainda.</p>
                            <Button className="mt-4" onClick={handleAnalyze}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Analisar emails
                            </Button>
                        </Card>
                    )}

                    <Card className="border-dashed flex items-center justify-center min-h-[100px] cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex flex-col items-center text-muted-foreground">
                            <Plus className="h-6 w-6 mb-2" />
                            <span className="font-medium">{t('labels_page.new_label')}</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
