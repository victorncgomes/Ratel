
import { ReactNode } from 'react';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
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
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 flex-1">
                    {/* Title & Description */}
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

                    {/* Stats */}
                    {stats && stats.length > 0 && (
                        <div className="flex flex-wrap items-center gap-6">
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
                                        <span className={`text-[10px] uppercase font-bold text-muted-foreground`}>
                                            {stat.label}
                                        </span>
                                        <span className={`text-xl font-black leading-none ${stat.color || (isNeobrutalist ? 'text-black' : 'text-foreground')}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                {action && (
                    <div className="flex-shrink-0 mt-4 md:mt-0">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
