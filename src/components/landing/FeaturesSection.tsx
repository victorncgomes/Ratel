import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import { StatsSection } from './StatsSection';
import { TestimonialsSection } from './TestimonialsSection';

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
    const { isNeobrutalist } = useStyleTheme();
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

                    {/* Progress indicator */}
                    <div className={`mt-8 h-1.5 w-full max-w-[100px] bg-slate-100 rounded-full overflow-hidden ${!isEven && 'ml-auto'}`}>
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
    const { isNeobrutalist } = useStyleTheme();

    // Split features to insert StatsSection and TestimonialsSection
    // First batch: Card 1 (Philosophy) + Card 2 (Intelligence)
    const firstBatch = FEATURES_METADATA.slice(0, 2);
    // Middle batch: Card 3 (Limpeza) + Card 4 (Não Me Perturbe) -> Entre Index 1 e 4 (2 e 3)
    const middleBatch = FEATURES_METADATA.slice(2, 4);
    // Last batch: Card 5 (Compras) + Card 6 (Newsletters) -> Index 4 em diante
    const lastBatch = FEATURES_METADATA.slice(4);

    return (
        <div className="bg-white overflow-hidden">
            {/* Header Section */}
            <section className="relative pt-24 lg:pt-40 pb-0">
                <div className="max-w-[1800px] mx-auto">
                    <div className="text-center mb-16 px-4 lg:px-0">
                        <span className={`inline-block px-5 py-2.5 rounded-full text-sm font-medium mb-8 ${isNeobrutalist
                            ? 'bg-[#E63946] text-white border-2 border-black shadow-[4px_4px_0_0_#000] rounded-none font-bold'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                            }`}>
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

            {/* Middle Features (Limpeza & Não Perturbe) */}
            <section className="relative py-0 bg-white">
                <div className="max-w-[1800px] mx-auto">
                    <div className="space-y-0">
                        {middleBatch.map((feature, index) => (
                            <FeatureCard key={index + 2} feature={feature} index={index + 2} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section (Inserted Here) */}
            <TestimonialsSection />

            {/* Remaining Features (Compras & Newsletters) */}
            <section className="relative py-0 bg-white">
                <div className="max-w-[1800px] mx-auto">
                    <div className="space-y-0">
                        {lastBatch.map((feature, index) => (
                            // Offset is 4 (2 from first + 2 from middle)
                            <FeatureCard key={index + 4} feature={feature} index={index + 4} />
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
