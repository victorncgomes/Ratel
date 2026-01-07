import { useIntersectionObserver, useCounterAnimation } from '../../hooks/useLandingAnimations';

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
    const count = useCounterAnimation(stat.value, 2500, shouldAnimate);

    return (
        <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-white mb-2 tabular-nums">
                <span className="bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
                    {formatNumber(count)}
                </span>
                <span className="text-teal-400">{stat.suffix}</span>
            </div>
            <p className="text-lg text-slate-300">{stat.label}</p>
        </div>
    );
}

export function StatsSection() {
    const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.3 });

    return (
        <section
            ref={ref}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2
                        className={`text-4xl lg:text-5xl font-bold text-white mb-4 transition-all duration-1000 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                    >
                        Impacto Global
                    </h2>
                    <p
                        className={`text-xl text-slate-400 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
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
