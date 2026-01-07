import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

interface FeatureMetadata {
    id: string;
    image: string;
    secondImage?: string;
    emoji: string;
}

const FEATURES_METADATA: FeatureMetadata[] = [
    {
        id: 'card_1',
        image: '/landing/ratel-envelope-hd.png',
        emoji: '💌'
    },
    {
        id: 'card_2',
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2015_19_53.png',
        emoji: '🧠'
    },
    {
        id: 'card_3',
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2019_27_16.png',
        emoji: '🧹'
    },
    {
        id: 'card_4',
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2016_32_42.png',
        emoji: '⚡'
    },
    {
        id: 'card_5',
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2018_18_51.png',
        secondImage: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2018_31_13.png',
        emoji: '🛒'
    },
    {
        id: 'card_6',
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2018_13_56.png',
        emoji: '📰'
    }
];

function FeatureCard({ feature, index }: { feature: FeatureMetadata; index: number }) {
    const { t } = useLanguage();
    const { isNeobrutalist } = useStyleTheme();
    const containerRef = useRef<HTMLDivElement>(null);

    const isEven = index % 2 === 0;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xInput = [0, 0.5, 1];

    const displacement = (index === 2 || index === 3) ? "100%" : "80%";
    const negDisplacement = (index === 2 || index === 3) ? "-100%" : "-80%";

    let centerTarget = "0%";
    if (index === 2) centerTarget = "-30%";
    else if (index === 0) centerTarget = "-15%";
    else if (index === 1) centerTarget = "5%";
    else if (index === 5) centerTarget = "10%";

    const rightImageOutput = [displacement, centerTarget, displacement];
    const leftImageOutput = [negDisplacement, centerTarget, negDisplacement];

    const x = useTransform(
        scrollYProgress,
        xInput,
        isEven ? rightImageOutput : leftImageOutput
    );

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <div
            ref={containerRef}
            className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 py-32 lg:py-48 min-h-screen overflow-hidden w-full max-w-full`}
        >
            {/* Image section */}
            <div className="flex-1 w-full relative">
                <motion.div
                    style={{ x, opacity }}
                    className="will-change-transform"
                >
                    {feature.secondImage ? (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-[30px] items-center justify-center -translate-x-20 lg:-translate-x-36">
                            <img
                                src={feature.secondImage}
                                alt={t(`landing.features.${feature.id}_title`)}
                                className="w-full sm:w-1/2 h-auto object-contain contrast-105 scale-[0.8] lg:scale-[1.65] -translate-y-5"
                                style={{
                                    minHeight: '200px',
                                    maxHeight: '500px',
                                    filter: 'brightness(1.02)'
                                }}
                                loading="eager"
                            />
                            <img
                                src={feature.image}
                                alt={t(`landing.features.${feature.id}_title`)}
                                className="w-full sm:w-1/2 h-auto object-contain contrast-105 scale-[0.8] lg:scale-[1.65] translate-y-5"
                                style={{
                                    minHeight: '200px',
                                    maxHeight: '500px',
                                    filter: 'brightness(1.02)'
                                }}
                                loading="eager"
                            />
                        </div>
                    ) : (
                        <img
                            src={feature.image}
                            alt={t(`landing.features.${feature.id}_title`)}
                            className={`w-full h-auto object-contain contrast-105 mx-auto ${index === 0 ? 'scale-[1.2]' : ''} ${index === 1 ? 'scale-[1.26]' : ''} ${index === 2 ? 'scale-[1.5]' : ''} ${index === 3 ? 'scale-[1.35]' : ''} ${index === 5 ? 'scale-[1.15]' : ''}`}
                            style={{
                                maxHeight: index === 0 ? undefined : '800px',
                                minHeight: index === 0 ? undefined : '400px',
                                filter: 'brightness(1.02)'
                            }}
                            loading="eager"
                        />
                    )}
                </motion.div>
            </div>

            {/* Text Section */}
            <div className="flex-1 z-10 w-full px-4 lg:px-8">
                <div className={`max-w-2xl ${isEven ? 'mr-auto' : 'ml-auto text-right'}`}>
                    <div className="flex items-center gap-4 mb-6 justify-start">
                        <span className="text-4xl lg:text-6xl filter drop-shadow-lg animate-bounce-slow">
                            {feature.emoji}
                        </span>
                        <h3 className={`text-3xl lg:text-5xl font-bold leading-tight ${isNeobrutalist
                                ? 'bg-black text-white px-4 py-2 shadow-[4px_4px_0_0_#000]'
                                : 'bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700'
                            }`}>
                            {t(`landing.features.${feature.id}_title`)}
                        </h3>
                    </div>

                    <p className={`text-xl lg:text-2xl leading-relaxed ${isNeobrutalist
                            ? 'font-bold border-l-4 border-black pl-4'
                            : 'text-slate-600'
                        }`}>
                        {t(`landing.features.${feature.id}_desc`)}
                    </p>

                    {/* Features list */}
                    <ul className={`mt-8 space-y-4 ${isEven ? 'text-left' : 'text-right'}`}>
                        {[1, 2, 3].map((i) => (
                            <li key={i} className={`flex items-center gap-3 ${!isEven && 'flex-row-reverse'}`}>
                                <div className={`w-2 h-2 rounded-full ${isNeobrutalist ? 'bg-black' : 'bg-blue-500'}`} />
                                <span className="text-lg text-slate-700">
                                    {t(`landing.features.${feature.id}_point_${i}`)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

interface FeaturesSectionProps {
    rangeStart?: number;
    rangeEnd?: number;
}

export function FeaturesSection({ rangeStart = 0, rangeEnd = FEATURES_METADATA.length }: FeaturesSectionProps) {
    const { t } = useLanguage();
    const { isNeobrutalist } = useStyleTheme();

    return (
        <section className="relative overflow-hidden">
            {/* Background Container - Sticky */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Gradient Orb 1 */}
                <div
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply"
                    style={{ transform: 'translate(30%, -30%)' }}
                />
                {/* Gradient Orb 2 */}
                <div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[100px] mix-blend-multiply"
                    style={{ transform: 'translate(-30%, 30%)' }}
                />
            </div>

            <div className="relative z-10 container mx-auto px-4">
                {/* Header apenas se for o início (rangeStart 0) */}
                {rangeStart === 0 && (
                    <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-32 pt-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className={`inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider uppercase ${isNeobrutalist
                                ? 'bg-[#ffde59] border-2 border-black shadow-[4px_4px_0_0_#000] text-black font-bold'
                                : 'bg-blue-50 text-blue-700 rounded-full'
                                }`}
                        >
                            {t('landing.features.title_badge')}
                        </motion.div>

                        <h2 className="text-4xl lg:text-7xl font-sans font-bold tracking-tight mb-8">
                            {t('landing.features.title_main')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                {t('landing.features.title_accent')}
                            </span>
                        </h2>

                        <p className="text-xl text-slate-600 leading-relaxed">
                            {t('landing.features.subtitle')}
                        </p>
                    </div>
                )}

                <div className="space-y-0">
                    {FEATURES_METADATA.map((feature, index) => {
                        // Filter logic based on range
                        if (index < rangeStart || index >= rangeEnd) return null;

                        return (
                            <FeatureCard
                                key={feature.id}
                                feature={feature}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
