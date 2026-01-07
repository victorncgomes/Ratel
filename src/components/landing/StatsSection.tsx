import { useIntersectionObserver, useCounterAnimation } from '../../hooks/useLandingAnimations';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

interface Stat {
    value: number;
    suffix: string;
    label: string;
    icon: string;
}

const STATS: Stat[] = [
    { value: 2500000, suffix: '+', label: 'Emails Excluídos', icon: '📧' },
    { value: 890000, suffix: '+', label: 'Inscrições Canceladas', icon: '🎯' },
    { value: 12000, suffix: '+', label: 'Horas Economizadas', icon: '⏰' },
    { value: 156000, suffix: '+', label: 'Usuários Ativos', icon: '👥' }
];

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

function StatCard({ stat, shouldAnimate }: { stat: Stat; shouldAnimate: boolean }) {
    const { isNeobrutalist } = useStyleTheme();
    const count = useCounterAnimation(stat.value, 2500, shouldAnimate);

    return (
        <div className={`text-center p-8 transition-all duration-500 group ${isNeobrutalist
            ? 'bg-white border-4 border-black shadow-[4px_4px_0_0_#FFF]'
            : 'rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10'
            }`}>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
            </div>
            <div className={`text-4xl lg:text-5xl font-bold mb-2 tabular-nums ${isNeobrutalist ? 'text-black' : 'text-white'}`}>
                <span className={isNeobrutalist ? 'text-black' : 'bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent'}>
                    {formatNumber(count)}
                </span>
                <span className={isNeobrutalist ? 'text-black' : 'text-teal-400'}>{stat.suffix}</span>
            </div>
            <p className={`text-lg ${isNeobrutalist ? 'text-black font-bold' : 'text-slate-300'}`}>{stat.label}</p>
        </div>
    );
}

export function StatsSection() {
    const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.3 });
    const { isNeobrutalist } = useStyleTheme();

    return (
        <section
            ref={ref}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className={`absolute inset-0 ${isNeobrutalist ? 'bg-[#70D6FF]' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'}`} />

            {/* Decorative Elements */}
            {!isNeobrutalist && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2
                        className={`text-4xl lg:text-5xl font-bold mb-4 transition-all duration-1000 ${isNeobrutalist ? 'text-black' : 'text-white'
                            } ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        Impacto Global
                    </h2>
                    <p
                        className={`text-xl max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isNeobrutalist ? 'text-black font-semibold' : 'text-slate-400'
                            } ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        Milhões de pessoas já transformaram sua relação com emails
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, index) => (
                        <div
                            key={index}
                            className={`transition-all duration-700 ${hasIntersected
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-12'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <StatCard stat={stat} shouldAnimate={hasIntersected} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
