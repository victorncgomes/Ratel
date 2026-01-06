import { cn } from '@/lib/utils';

interface RateFilterProps {
    currentFilter: 'all' | 'keep' | 'neutral' | 'delete';
    onFilterChange: (filter: 'all' | 'keep' | 'neutral' | 'delete') => void;
    counts?: {
        all: number;
        keep: number;
        neutral: number;
        delete: number;
    };
}

export function RateFilter({ currentFilter, onFilterChange, counts }: RateFilterProps) {
    const filters = [
        { id: 'all' as const, label: 'Todos', emoji: '📬', color: 'bg-secondary' },
        { id: 'keep' as const, label: 'Manter', emoji: '⭐', color: 'bg-green-500/20 text-green-600' },
        { id: 'neutral' as const, label: 'Neutros', emoji: '❓', color: 'bg-yellow-500/20 text-yellow-600' },
        { id: 'delete' as const, label: 'Deletar', emoji: '🗑️', color: 'bg-red-500/20 text-red-600' }
    ];

    return (
        <div className="flex gap-2 p-2 glass-card rounded-sm mb-4">
            {filters.map(filter => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-medium transition-all',
                        currentFilter === filter.id
                            ? `${filter.color} shadow-sm`
                            : 'hover:bg-secondary/50'
                    )}
                >
                    <span>{filter.emoji}</span>
                    <span>{filter.label}</span>
                    {counts && (
                        <span className="text-xs opacity-70">
                            ({counts[filter.id]})
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
