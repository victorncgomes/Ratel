import { getRateColor, getRateEmoji, getRateBgColor } from '../services/rateService';
import { cn } from '@/lib/utils';

interface RateBadgeProps {
    score: number;
    showEmoji?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function RateBadge({ score, showEmoji = true, size = 'md', className }: RateBadgeProps) {
    const colorClass = getRateColor(score);
    const bgClass = getRateBgColor(score);
    const emoji = showEmoji ? getRateEmoji(score) : null;

    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5',
        md: 'text-sm px-2 py-1',
        lg: 'text-base px-3 py-1.5'
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-sm font-bold',
                bgClass,
                colorClass,
                sizeClasses[size],
                className
            )}
            title={`RATE Score: ${score}/100`}
        >
            {emoji && <span>{emoji}</span>}
            <span>{score}</span>
        </div>
    );
}

interface RateBarProps {
    score: number;
    showLabel?: boolean;
    className?: string;
}

export function RateBar({ score, showLabel = true, className }: RateBarProps) {
    const colorClass = getRateColor(score);

    // Compute gradient based on score
    const getGradient = () => {
        if (score <= 20) return 'from-red-500 to-red-400';
        if (score <= 40) return 'from-orange-500 to-orange-400';
        if (score <= 60) return 'from-yellow-500 to-yellow-400';
        if (score <= 80) return 'from-green-400 to-green-500';
        return 'from-green-500 to-green-600';
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                    className={cn('h-full bg-gradient-to-r transition-all duration-500', getGradient())}
                    style={{ width: `${score}%` }}
                />
            </div>
            {showLabel && (
                <span className={cn('text-xs font-bold min-w-[32px]', colorClass)}>
                    {score}
                </span>
            )}
        </div>
    );
}
