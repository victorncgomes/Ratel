/**
 * Virtualized Email List - Renders only visible emails for 10K+ performance
 */

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Email {
    id: string;
    subject: string;
    from: string;
    snippet: string;
    date: string;
    rateScore?: number;
    hasUnsubscribe?: boolean;
}

interface VirtualizedEmailListProps {
    emails: Email[];
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onSelectAll: () => void;
    allSelected: boolean;
    loading?: boolean;
}

export function VirtualizedEmailList({
    emails,
    selectedIds,
    onToggleSelect,
    onSelectAll,
    allSelected,
    loading
}: VirtualizedEmailListProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: emails.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80, // Approximate height of each email item
        overscan: 10 // Render 10 extra items above/below viewport
    });

    const items = virtualizer.getVirtualItems();

    return (
        <div className="flex flex-col h-full">
            {/* Select All Header */}
            <button
                onClick={onSelectAll}
                className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 rounded-sm transition-colors text-left border-b border-border/50"
            >
                {allSelected ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">
                    {allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                    {emails.length.toLocaleString()} emails
                </span>
            </button>

            {/* Virtualized List */}
            <div
                ref={parentRef}
                className="flex-1 overflow-auto"
                style={{ contain: 'strict' }}
            >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {items.map(virtualRow => {
                        const email = emails[virtualRow.index];
                        const isSelected = selectedIds.has(email.id);

                        return (
                            <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualRow.start}px)`
                                }}
                            >
                                <div
                                    className={cn(
                                        "flex items-start gap-3 p-3 mx-1 my-0.5 rounded-sm cursor-pointer transition-all",
                                        isSelected
                                            ? "bg-primary/10 border border-primary/30"
                                            : "hover:bg-secondary/50"
                                    )}
                                    onClick={() => onToggleSelect(email.id)}
                                >
                                    {/* Checkbox */}
                                    {isSelected ? (
                                        <CheckSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Square className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium text-sm truncate flex-1">
                                                {email.subject || '(Sem assunto)'}
                                            </p>
                                        </div>

                                        <p className="text-xs text-muted-foreground truncate">
                                            {email.snippet}
                                        </p>

                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-muted-foreground truncate">
                                                {email.from?.split('<')[0]?.trim() || email.from}
                                            </p>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(email.date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Loading indicator at bottom */}
            {loading && (
                <div className="p-3 text-center text-sm text-muted-foreground border-t">
                    Carregando mais emails...
                </div>
            )}
        </div>
    );
}
