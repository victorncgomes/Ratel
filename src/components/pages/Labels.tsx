
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Tag, Plus, MoreHorizontal } from 'lucide-react';

const mockLabels = [
    { name: 'Importante', color: 'bg-red-500', count: 12 },
    { name: 'Trabalho', color: 'bg-blue-500', count: 45 },
    { name: 'Finanças', color: 'bg-green-500', count: 8 },
    { name: 'Viagens', color: 'bg-yellow-500', count: 3 },
    { name: 'Projetos', color: 'bg-purple-500', count: 15 },
    { name: 'Pessoal', color: 'bg-pink-500', count: 22 },
];

export function LabelsPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Labels</h2>
                    <p className="text-muted-foreground">Organize seus emails com etiquetas coloridas.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Label
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockLabels.map((label, i) => (
                    <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Tag className={`h-5 w-5 ${label.color.replace('bg-', 'text-')}`} />
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

                <Card className="border-dashed flex items-center justify-center min-h-[100px] cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col items-center text-muted-foreground">
                        <Plus className="h-6 w-6 mb-2" />
                        <span className="font-medium">Criar Nova</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
