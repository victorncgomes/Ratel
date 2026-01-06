import { useMemo } from 'react';
import { Mail, User, Calendar, Box, Tag, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GroupedItem {
    id: string;
    name: string;
    email?: string;
    count: number;
    isMailingList?: boolean;
    color?: string;
}

interface GroupsColumnProps {
    items: GroupedItem[];
    selectedId: string | null;
    onSelect: (item: GroupedItem) => void;
    viewType: 'by-sender' | 'by-size' | 'by-date' | 'newsletters' | 'promotions';
    loading?: boolean;
}

export function GroupsColumn({ items, selectedId, onSelect, viewType, loading }: GroupsColumnProps) {
    const getIcon = () => {
        switch (viewType) {
            case 'by-sender': return User;
            case 'by-size': return Box;
            case 'by-date': return Calendar;
            case 'newsletters': return Mail;
            case 'promotions': return ShoppingBag;
            default: return Tag;
        }
    };

    const Icon = getIcon();

    const getAvatarColor = (name: string) => {
        const colors = [
            'bg-gradient-to-br from-blue-400 to-blue-600',
            'bg-gradient-to-br from-green-400 to-green-600',
            'bg-gradient-to-br from-purple-400 to-purple-600',
            'bg-gradient-to-br from-orange-400 to-orange-600',
            'bg-gradient-to-br from-pink-400 to-pink-600',
            'bg-gradient-to-br from-teal-400 to-teal-600',
            'bg-gradient-to-br from-red-400 to-red-600',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                        {items.length} grupos
                    </span>
                </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-sm text-left transition-all duration-200',
                            selectedId === item.id
                                ? 'glass-card shadow-lg border-primary/30'
                                : 'hover:bg-secondary/50'
                        )}
                    >
                        {/* Avatar */}
                        <div className={cn(
                            'w-10 h-10 rounded-sm flex items-center justify-center text-white font-bold text-sm shadow-md',
                            item.color || getAvatarColor(item.name)
                        )}>
                            {item.name.substring(0, 2).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{item.name}</p>
                            {item.email && (
                                <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                            )}
                        </div>

                        {/* Count Badge */}
                        <div className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-bold min-w-[32px] text-center',
                            selectedId === item.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground'
                        )}>
                            {item.count}
                        </div>
                    </button>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        Nenhum grupo encontrado
                    </div>
                )}
            </div>
        </div>
    );
}
