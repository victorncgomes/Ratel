import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
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
        // Restoring to 15_19_53 as requested for "Classificação Inteligente"
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2015_19_53.png',
        emoji: '🧠'
    },
    {
        id: 'card_3', // Limpeza na Caixa de Entrada - ratel lendo jornal
        // Keeping the updated image for Cleanup
        image: '/images/ChatGPT%20Image%205%20de%20jan.%20de%202026,%2019_27_16.png?v=2',
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
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isDesktop = useMediaQuery('(min-width: 1024px)'); // PC = lg breakpoint

    // Inverted logic: 
    // index 0 (even) -> flex-row-reverse (Text Left, Image Right)
    // index 1 (odd) -> flex-row (Image Left, Text Right)
    const isEven = index % 2 === 0;

    // Scroll progress for the card container
    // offset: center center means the animation is 0.5 when element center is at viewport center
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center", "end start"]
    });

    // Parallax effect logic
    const xInput = [0, 0.5, 1];

    // Reduced displacements as requested
    const displacement = (index === 2 || index === 3) ? "50%" : "40%";
    const negDisplacement = (index === 2 || index === 3) ? "-50%" : "-40%";

    let centerTarget = "0%";
    if (index === 2) centerTarget = "-20%"; // Reduced from -30%
    else if (index === 0) centerTarget = "-10%";
    else if (index === 1) centerTarget = "25%";
    else if (index === 5) centerTarget = "10%";

    const rightImageOutput = [displacement, centerTarget, displacement];
    const leftImageOutput = [negDisplacement, centerTarget, negDisplacement];

    // Main image transform
    const x = useTransform(
        scrollYProgress,
        xInput,
        isEven ? rightImageOutput : leftImageOutput
    );

    // === CARD 5 (Compras): Transforms distintos para cada imagem ===
    // BACKUP VALORES ANTERIORES: ambas usavam x (40% → 0% → 40%)
    // PC (>=1024px): 
    // Imagem 1: começa 200% direita, centro -90%, termina 200% direita
    const comprasImg1Output = ["200%", "-90%", "200%"];
    const xComprasImg1 = useTransform(scrollYProgress, xInput, comprasImg1Output);
    // Imagem 2: começa 40% direita, centro -50%, termina 40% direita
    const comprasImg2Output = ["40%", "-50%", "40%"];
    const xComprasImg2 = useTransform(scrollYProgress, xInput, comprasImg2Output);

    // TABLET (768-1023px): valores intermediários, centralizados no platô
    // Imagem 1: começa 80% direita, centro 0% (centralizado), termina 80% direita
    const comprasImg1TabletOutput = ["80%", "0%", "80%"];
    const xComprasImg1Tablet = useTransform(scrollYProgress, xInput, comprasImg1TabletOutput);
    // Imagem 2: começa 60% direita, centro 0% (centralizado), termina 60% direita  
    const comprasImg2TabletOutput = ["60%", "0%", "60%"];
    const xComprasImg2Tablet = useTransform(scrollYProgress, xInput, comprasImg2TabletOutput);

    // Para card 5: usa transforms específicos por breakpoint
    const isTablet = !isMobile && !isDesktop; // 768-1023px
    const firstImageX = (index === 4)
        ? (isMobile ? x : isDesktop ? xComprasImg1 : xComprasImg1Tablet)
        : x;

    // Specific transform for 2nd image on mobile (Card 5)
    // Desktop: Flows with 'x' (Right->Left if isEven)
    // Mobile: Should go Left->Right ("negDisplacement" -> "displacement")
    const mobileSecondImageOutput = [negDisplacement, centerTarget, displacement];

    // We can't conditionally call hooks, so we must calculate all transforms
    const xMobileSecond = useTransform(scrollYProgress, xInput, mobileSecondImageOutput);

    // Final transform for 2nd image: toggle based on breakpoint
    // Card 5: PC usa xComprasImg2, Tablet usa xComprasImg2Tablet, Mobile usa xMobileSecond
    const secondImageX = isMobile
        ? xMobileSecond
        : (index === 4 ? (isDesktop ? xComprasImg2 : xComprasImg2Tablet) : x);


    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    // Restore Parallax Progress Indicator
    // Map scrollY [0, 1] to width [0px, 100px] (roughly)
    const progressWidth = useTransform(scrollYProgress, [0.3, 0.6], ["0%", "100%"]);

    return (
        <div
            ref={containerRef}
            className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 py-32 lg:py-48 min-h-screen overflow-hidden w-full max-w-full`}
        >
            {/* Image section: z-0 for cards 0, 1, 2, 3, 5 (behind text), z-20 for card 4 only */}
            <div className={`flex-1 w-full relative ${index === 4 ? 'z-20' : 'z-0'}`}>
                <motion.div
                    // For single images, apply 'x'. For merged card, we handle inside.
                    style={{ x: feature.secondImage ? 0 : x, opacity }}
                    className="will-change-transform"
                >
                    {feature.secondImage ? (
                        /* 
                         * COMPRAS & BLINDAGEM - VALUES SAVED:
                         * PC (>=1024px): scale=2.25, translateY img1=-1.25rem, img2=3.25rem, gap=10px, translate-x=20
                         * Mobile (<=767px): scale=0.8, translateY img1=-0.5rem, img2=0.5rem, flex-col
                         * Tablet (768-1023px): scale=1.2, flex-row, values intermediários
                         */
                        <div className={`flex items-center justify-center ${isMobile
                            ? 'flex-col gap-0'
                            : isDesktop
                                ? 'flex-row gap-[10px] translate-x-20'
                                : 'flex-row gap-[20px] translate-x-10'
                            }`}>
                            {/* Image 1 (Left/Top) */}
                            <motion.img
                                style={{
                                    x: firstImageX,
                                    filter: 'brightness(1.02)',
                                    scale: isMobile ? 0.8 : isDesktop ? 2.25 : 1.2,
                                    translateY: isMobile ? '-0.5rem' : isDesktop ? '-1.25rem' : '-0.5rem'
                                }}
                                src={feature.secondImage}
                                alt={t(`landing.features.${feature.id}_title`)}
                                width="400"
                                height="400"
                                className={`h-auto object-contain contrast-105 ${isMobile ? 'w-full' : 'w-1/2'}`}
                                loading="eager"
                            />
                            {/* Image 2 (Right/Bottom) */}
                            <motion.img
                                style={{
                                    x: secondImageX,
                                    filter: 'brightness(1.02)',
                                    scale: isMobile ? 0.8 : isDesktop ? 2.25 : 1.2,
                                    translateY: isMobile ? '0.5rem' : isDesktop ? '3.25rem' : '0.5rem'
                                }}
                                src={feature.image}
                                alt={t(`landing.features.${feature.id}_title`)}
                                width="400"
                                height="400"
                                className={`h-auto object-contain contrast-105 ${isMobile ? 'w-full' : 'w-1/2'}`}
                                loading="eager"
                            />
                        </div>
                    ) : (
                        <img
                            src={feature.image}
                            alt={t(`landing.features.${feature.id}_title`)}
                            width="800"
                            height="600"
                            className={`w-full h-auto object-contain contrast-105 mx-auto ${index === 0 ? 'scale-[1.2]' : ''} ${index === 1 ? 'scale-[1.5]' : ''} ${index === 2 ? (isDesktop ? 'scale-[1.5]' : isMobile ? 'scale-[1.5]' : 'scale-[1.2]') : ''} ${index === 3 ? 'scale-[1.35]' : ''} ${index === 5 ? 'scale-[1.15]' : ''}`}
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

            {/* Text Section: z-30 for card 5 on PC to be on top of image */}
            <div className={`flex-1 w-full px-4 lg:px-8 ${index === 4 ? 'z-10 lg:z-30' : 'z-10'}`}>
                <div className={`max-w-2xl ${isEven ? 'mr-auto' : 'ml-auto text-right'}`}>
                    <div className="flex items-center gap-4 mb-6 justify-start">
                        {/* HIDE EMOJI IN NEOBRUTALIST */}
                        {!isNeobrutalist && (
                            <span className="text-4xl lg:text-6xl filter drop-shadow-lg animate-bounce-slow">
                                {feature.emoji}
                            </span>
                        )}
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

                    {/* Parallax Progress Indicator */}
                    <div className={`mt-8 h-1.5 w-full max-w-[100px] bg-slate-100 rounded-full overflow-hidden ${!isEven && 'ml-auto'}`}>
                        <motion.div
                            style={{ width: progressWidth }}
                            className="h-1.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FeaturesSection() {
    const { t } = useLanguage();
    const { isNeobrutalist } = useStyleTheme();


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

                    {/* Features cards 0-1 */}
                    <section className="relative py-0 bg-white">
                        <div className="max-w-[1800px] mx-auto">
                            <div className="space-y-0">
                                {FEATURES_METADATA.slice(0, 2).map((feature, index) => (
                                    <FeatureCard key={index} feature={feature} index={index} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Stats Section (Impacto Global) - Between Classificação and Limpeza */}
                    <StatsSection />

                    {/* Features cards 2-5 */}
                    <section className="relative py-0 bg-white">
                        <div className="max-w-[1800px] mx-auto">
                            <div className="space-y-0">
                                {FEATURES_METADATA.slice(2).map((feature, index) => (
                                    <FeatureCard key={index + 2} feature={feature} index={index + 2} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <TestimonialsSection />

                    <style>{`
                @keyframes pulse-subtle {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
                </div>
            </section>
        </div>
    );
}
