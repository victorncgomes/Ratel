import { useIntersectionObserver } from '../../hooks/useLandingAnimations';
import { useLanguage } from '../../contexts/LanguageContext';

interface FeatureMetadata {
    id: string; // Key for translation: landing.features.card_N_title
    image: string;
    secondImage?: string; // Optional second image for merged sections
    emoji: string;
}

const FEATURES_METADATA: FeatureMetadata[] = [
    {
        id: 'card_1', // Filosofia Ratel - envelope image
        image: '/landing/ratel-envelope.jpg?v=1',
        emoji: '💌'
    },
    {
        id: 'card_2', // Classificação Inteligente - smartphone image
        image: '/landing/ratel-mobile.png?v=1',
        emoji: '🧠'
    },
    {
        id: 'card_3', // Limpeza na Caixa de Entrada (was Dashboard Analytics)
        image: '/landing/ratel-cleanup.png?v=1',
        emoji: '🧹'
    },
    {
        id: 'card_4', // Ratel Furioso (merged with Cancele Inscrições)
        image: '/landing/ratel-feature-4.png?v=4',
        emoji: '⚡'
    },
    {
        id: 'card_5', // Compras + Marketing (merged section with two images)
        image: '/landing/ratel-shopping.png?v=1',
        secondImage: '/landing/ratel-marketing.png?v=1',
        emoji: '🛒'
    },
    {
        id: 'card_6', // Newsletters Reunidos (Rollup) - reading image
        image: '/landing/ratel-reading.png?v=1',
        emoji: '📰'
    }
];

function FeatureCard({ feature, index }: { feature: FeatureMetadata; index: number }) {
    const { t } = useLanguage();
    const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
    const isEven = index % 2 === 0;

    return (
        <div
            ref={ref}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24 py-32 lg:py-48 min-h-screen`}
        >
            {/* Image section */}
            <div className="flex-1 w-full relative">
                <div
                    className={`transition-all duration-1000 transform ${isIntersecting ? 'opacity-100 translate-x-0' : `opacity-0 ${isEven ? '-translate-x-10' : 'translate-x-10'}`
                        }`}
                >
                    {feature.secondImage ? (
                        // Two images side by side for merged sections
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <img
                                src={feature.image}
                                alt={t(`landing.features.${feature.id}_title`)}
                                className="w-full sm:w-1/2 h-auto object-contain contrast-105"
                                style={{
                                    minHeight: '200px',
                                    maxHeight: '500px',
                                    mixBlendMode: 'multiply',
                                    filter: 'brightness(1.02)'
                                }}
                                loading="eager"
                            />
                            <img
                                src={feature.secondImage}
                                alt={t(`landing.features.${feature.id}_title`)}
                                className="w-full sm:w-1/2 h-auto object-contain contrast-105"
                                style={{
                                    minHeight: '200px',
                                    maxHeight: '500px',
                                    mixBlendMode: 'multiply',
                                    filter: 'brightness(1.02)'
                                }}
                                loading="eager"
                            />
                        </div>
                    ) : (
                        // Single image
                        <img
                            src={feature.image.replace('?v=4', '?v=6')}
                            alt={t(`landing.features.${feature.id}_title`)}
                            className="w-full h-auto object-contain contrast-105"
                            style={{
                                minHeight: '400px',
                                maxHeight: '800px',
                                mixBlendMode: 'multiply',
                                filter: 'brightness(1.02)'
                            }}
                            loading="eager"
                        />
                    )}
                </div>
            </div>

            {/* Text content */}
            <div
                className="flex-1"
                style={{
                    opacity: isIntersecting ? 1 : 0,
                    transform: `translateY(${isIntersecting ? 0 : 60}px)`,
                    transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div className="max-w-lg mx-auto lg:mx-0">
                    <div
                        className="inline-flex items-center gap-3 mb-8 px-5 py-3 bg-gradient-to-r from-blue-50 to-violet-50 rounded-full shadow-lg"
                        style={{
                            animation: isIntersecting ? 'pulse-subtle 3s ease-in-out infinite' : 'none'
                        }}
                    >
                        <span className="text-5xl">{feature.emoji}</span>
                        <div className="h-8 w-px bg-slate-200" />
                        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('landing.features.feature_badge')}</span>
                    </div>

                    <h3 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-10 leading-tight">
                        {t(`landing.features.${feature.id}_title`)}
                    </h3>

                    <p className="text-2xl text-slate-600 leading-relaxed mb-10">
                        {t(`landing.features.${feature.id}_desc`)}
                    </p>

                    <div className="flex items-center gap-4">
                        <div
                            className="h-1.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-1000"
                            style={{ width: isIntersecting ? '80px' : '0px' }}
                        />
                        <div
                            className="h-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-1000 delay-150"
                            style={{ width: isIntersecting ? '40px' : '0px' }}
                        />
                        <div
                            className="h-1.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transition-all duration-1000 delay-300"
                            style={{ width: isIntersecting ? '20px' : '0px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FeaturesSection() {
    const { t } = useLanguage();

    return (
        // Changed to pure white background to integrate seamlessly with white-background images
        <section className="relative py-24 lg:py-40 bg-white overflow-hidden">
            <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
                <div className="text-center mb-32">
                    <span className="inline-block px-5 py-2.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 shadow-md">
                        {t('landing.features.title_badge')}
                    </span>
                    <h2 className="text-6xl lg:text-7xl font-bold text-slate-800 mb-8 leading-tight">
                        {t('landing.features.title_main')}<br />
                        <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                            {t('landing.features.title_accent')}
                        </span>
                    </h2>
                    <p className="text-2xl lg:text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                        {t('landing.features.subtitle')}
                    </p>
                </div>

                <div className="space-y-0">
                    {FEATURES_METADATA.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse-subtle {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
        </section>
    );
}
