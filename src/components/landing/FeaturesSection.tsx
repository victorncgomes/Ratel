import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatsSection } from './StatsSection';

interface FeatureMetadata {
    id: string; // Key for translation: landing.features.card_N_title
    image: string;
    secondImage?: string; // Optional second image for merged sections
    emoji: string;
}

const FEATURES_METADATA: FeatureMetadata[] = [
    {
        id: 'card_1', // Filosofia Ratel - envelope image
        image: '/landing/ratel-envelope-hd.png',
        emoji: '💌'
    },
    {
        id: 'card_2', // Classificação Inteligente - smartphone image
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2015_19_53.png',
        emoji: '🧠'
    },
    {
        id: 'card_3', // Limpeza na Caixa de Entrada - ratel lendo jornal
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2019_27_16.png',
        emoji: '🧹'
    },
    {
        id: 'card_4', // Não Me Perturbe Mais - ratel correndo
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2016_32_42.png',
        emoji: '⚡'
    },
    {
        id: 'card_5', // Compras + Anti-spam (esquerda: 18_31_13, direita: 18_18_51)
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2018_18_51.png',
        secondImage: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2018_31_13.png',
        emoji: '🛒'
    },
    {
        id: 'card_6', // Newsletters Reunidos - ratel na poltrona
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2018_13_56.png',
        emoji: '📰'
    }
];

function FeatureCard({ feature, index }: { feature: FeatureMetadata; index: number }) {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    // Inverted logic: 
    // index 0 (even) -> flex-row-reverse (Text Left, Image Right)
    // index 1 (odd) -> flex-row (Image Left, Text Right)
    const isEven = index % 2 === 0;

    // Scroll progress for the card container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect logic
    // If image is on Right (isEven=true): 
    //   Enters from Right (+50% to 0) -> Exits to Left (0 to -50%)
    // If image is on Left (isEven=false):
    //   Enters from Left (-50% to 0) -> Exits to Right (0 to +50%)

    // Original working animation: smooth enter from side, center, exit to opposite side
    const xInput = [0, 0.5, 1];

    // Bounce back: enter from side, center, return to same side
    // Index 2 (Limpeza) needs to go further left at center (-30%)
    // Index 1 (Intelligence) and 5 (Newsletters) need to go further right at center (+25%)
    const displacement = (index === 2 || index === 3) ? "100%" : "80%";
    const negDisplacement = (index === 2 || index === 3) ? "-100%" : "-80%";

    let centerTarget = "0%";
    if (index === 2) centerTarget = "-30%";
    else if (index === 0) centerTarget = "-15%"; // Filosofia: mais 5 pontos para esquerda (era -10%)
    else if (index === 1) centerTarget = "5%"; // Classificação: mais para esquerda (era 15%)
    else if (index === 5) centerTarget = "10%"; // Newsletters

    const rightImageOutput = [displacement, centerTarget, displacement];
    const leftImageOutput = [negDisplacement, centerTarget, negDisplacement];

    const x = useTransform(
        scrollYProgress,
        xInput,
        isEven ? rightImageOutput : leftImageOutput
    );

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    // Removed dynamic scale as requested

    return (
        <div
            ref={containerRef}
            className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 py-32 lg:py-48 min-h-screen overflow-hidden w-full max-w-full`}
        >
            {/* Image section */}
            {/* Image section */}
            <div className="flex-1 w-full relative">
                <motion.div
                    style={{ x, opacity }}
                    className="will-change-transform"
                >
                    {feature.secondImage ? (
                        // Two images side by side for merged sections
                        // Order: secondImage (marketing) LEFT, image (shopping) RIGHT
                        // Adjusted: Gap 30px, shifted left, responsive scale (0.8 mobile, 1.5 desktop)
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
                        // Single image
                        <img
                            src={feature.image}
                            alt={t(`landing.features.${feature.id}_title`)}
                            // ScaledDown Intelligence (index 1) to 1.05
                            // ScaledDown Interrupt (index 3) to 1.35 (was 1.5)
                            // ScaledUp Newsletters (index 5) to 1.15
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

            {/* Text content - with max-width constraint */}
            <motion.div
                className="flex-1 max-w-[1800px] mx-auto px-6 lg:px-12"
                style={{
                    opacity: useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]),
                    y: useTransform(scrollYProgress, [0, 1], [100, -100]) // Parallax vertical for text
                }}
            >
                <div className="max-w-lg mx-auto lg:mx-0">
                    <div
                        className="inline-flex items-center gap-3 mb-8 px-5 py-3 bg-gradient-to-r from-blue-50 to-violet-50 rounded-full shadow-lg"
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
                        <motion.div
                            initial={{ width: 0, x: 50 }}
                            whileInView={{ width: "5rem", x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-1.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                        />
                        <motion.div
                            initial={{ width: 0, x: 40 }}
                            whileInView={{ width: "2.5rem", x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="h-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                        />
                        <motion.div
                            initial={{ width: 0, x: 30 }}
                            whileInView={{ width: "1.25rem", x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="h-1.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export function FeaturesSection() {
    const { t } = useLanguage();

    // Split features to insert StatsSection in between
    // First batch: Card 1 (Philosophy) + Card 2 (Intelligence)
    const firstBatch = FEATURES_METADATA.slice(0, 2);
    // Second batch: Rest of cards
    const secondBatch = FEATURES_METADATA.slice(2);

    return (
        <div className="bg-white overflow-hidden">
            {/* Header Section */}
            <section className="relative pt-24 lg:pt-40 pb-0">
                <div className="max-w-[1800px] mx-auto">
                    <div className="text-center mb-16 px-4 lg:px-0">
                        <span className="inline-block px-5 py-2.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 shadow-md">
                            {t('landing.features.title_badge')}
                        </span>
                        {/* Mobile: texto em container branco com padding e fonte menor */}
                        <div className="bg-white/90 lg:bg-transparent rounded-2xl lg:rounded-none p-4 lg:p-0 shadow-lg lg:shadow-none mx-auto max-w-[95%] lg:max-w-none">
                            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-800 mb-6 lg:mb-8 leading-tight">
                                {t('landing.features.title_main')}<br />
                                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    {t('landing.features.title_accent')}
                                </span>
                            </h2>
                            <p className="text-lg sm:text-xl lg:text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                                {t('landing.features.subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-0">
                        {firstBatch.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section (Full Width) */}
            <StatsSection />

            {/* Remaining Features */}
            <section className="relative py-0 bg-white">
                <div className="max-w-[1800px] mx-auto">
                    <div className="space-y-0">
                        {secondBatch.map((feature, index) => (
                            // Add offset to index to maintain correct parity for alternating layout
                            <FeatureCard key={index + 2} feature={feature} index={index + 2} />
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes pulse-subtle {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
}

