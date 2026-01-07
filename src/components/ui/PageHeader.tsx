
import { ReactNode } from 'react';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import { Card, CardContent } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatItem {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    color?: string; // Tailwind text color class e.g. 'text-blue-500'
    bgColor?: string; // Gradient or solid bg class
}

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    stats?: StatItem[];
    loading?: boolean;
}

export function PageHeader({ title, description, action, stats, loading }: PageHeaderProps) {
    const { isNeobrutalist } = useStyleTheme();

    return (
        <div className="space-y-6 mb-8">
            {/* Top Bar: Title & Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-heading font-black tracking-tight flex items-center gap-3 ${isNeobrutalist ? 'uppercase' : ''}`}>
                        <span className={isNeobrutalist ? 'text-black' : 'gradient-text'}>{title}</span>
                    </h1>
                    {description && (
                        <p className={`text-muted-foreground mt-1 ${isNeobrutalist ? 'font-medium' : ''}`}>
                            {description}
                        </p>
                    )}
                </div>
                {action && (
                    <div className="flex-shrink-0">
                        {action}
                    </div>
                )}
            </div>

            {/* Stats Bar (Optional) */}
            {stats && stats.length > 0 && (
                <Card variant="glass" className={`${isNeobrutalist ? 'border-4 border-black shadow-[6px_6px_0_0_#000] rounded-none bg-white' : ''}`}>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap items-center gap-6 md:gap-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    {stat.icon && (
                                        <div className={`p-2 rounded-lg ${isNeobrutalist
                                                ? 'bg-black text-white shadow-[2px_2px_0_0_#888]'
                                                : (stat.bgColor || 'bg-primary/10')
                                            }`}>
                                            <stat.icon className={`h-5 w-5 ${isNeobrutalist ? 'text-white' : stat.color}`} />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className={`text-sm text-muted-foreground ${isNeobrutalist ? 'font-bold uppercase text-xs' : ''}`}>
                                            {stat.label}
                                        </span>
                                        <span className={`text-2xl font-black ${stat.color || (isNeobrutalist ? 'text-black' : 'text-foreground')}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
