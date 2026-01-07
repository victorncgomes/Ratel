import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

interface TestimonialKey {
    text: string;
    author: string;
    role: string;
    company: string;
    avatar: string;
}

const TESTIMONIALS_KEYS: TestimonialKey[] = [
    {
        text: "quote_1",
        author: "Marina Costa",
        role: "author_1_role",
        company: "Nubank",
        avatar: "MC"
    },
    {
        text: "quote_5",
        author: "Pedro Henrique",
        role: "author_5_role",
        company: "Globo",
        avatar: "PH"
    },
    {
        text: "quote_6",
        author: "Ana Beatriz",
        role: "author_6_role",
        company: "iFood",
        avatar: "AB"
    },
    {
        text: "quote_2",
        author: "Lucas Mendes",
        role: "author_2_role",
        company: "Mercado Livre",
        avatar: "LM"
    },
    {
        text: "quote_4",
        author: "Camila Ferreira",
        role: "author_4_role",
        company: "Startup XYZ",
        avatar: "CF"
    }
];

export function TestimonialsSection() {
    const { t } = useLanguage();
    const { isNeobrutalist } = useStyleTheme();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_KEYS.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_KEYS.length) % TESTIMONIALS_KEYS.length);
    };

    // Show 3 testimonials at a time on desktop, 1 on mobile
    const getVisibleTestimonials = () => {
        const visible: TestimonialKey[] = [];
        for (let i = 0; i < 3; i++) {
            visible.push(TESTIMONIALS_KEYS[(currentIndex + i) % TESTIMONIALS_KEYS.length]);
        }
        return visible;
    };

    return (
        <section className={`py-24 lg:py-32 ${isNeobrutalist ? 'bg-[#FFDE59]' : 'bg-gradient-to-b from-white to-slate-50'}`}>
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
                        {t('landing.testimonials.title')}
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        {t('landing.testimonials.subtitle')}
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevTestimonial}
                        className={`absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isNeobrutalist
                            ? 'bg-white border-2 border-black shadow-[4px_4px_0_0_#000] text-black hover:shadow-[6px_6px_0_0_#000]'
                            : 'bg-white shadow-lg text-slate-600 hover:text-slate-900 hover:shadow-xl'
                            }`}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className={`absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isNeobrutalist
                            ? 'bg-white border-2 border-black shadow-[4px_4px_0_0_#000] text-black hover:shadow-[6px_6px_0_0_#000]'
                            : 'bg-white shadow-lg text-slate-600 hover:text-slate-900 hover:shadow-xl'
                            }`}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {getVisibleTestimonials().map((testimonial, index) => (
                            <div
                                key={`${testimonial.author}-${index}`}
                                className={`p-8 transition-all duration-500 group ${isNeobrutalist
                                    ? 'bg-white border-4 border-black shadow-[8px_8px_0_0_#000]'
                                    : 'rounded-3xl bg-white/70 backdrop-blur-sm border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1'
                                    }`}
                            >
                                {/* Quote Icon */}
                                <Quote className="h-8 w-8 text-blue-500/30 mb-6 group-hover:text-blue-500/50 transition-colors duration-300" />

                                {/* Text */}
                                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                                    "{t(`landing.testimonials.${testimonial.text}`)}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${isNeobrutalist ? 'text-black' : 'text-slate-800'}`}>
                                            {testimonial.author}
                                        </p>
                                        <p className={`text-sm ${isNeobrutalist ? 'text-black font-medium' : 'text-slate-500'}`}>
                                            {t(`landing.testimonials.${testimonial.role}`)} @ {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-10">
                    {TESTIMONIALS_KEYS.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? (isNeobrutalist ? 'bg-black w-8 border border-black' : 'bg-blue-600 w-8')
                                : (isNeobrutalist ? 'bg-transparent border border-black' : 'bg-slate-300 hover:bg-slate-400')
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
