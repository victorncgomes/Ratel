import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Loader2, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface HeroSectionProps {
    onLogin: (provider: string) => void;
    onShowTerms?: () => void;
    onShowPrivacy?: () => void;
}

const TESTIMONIALS_KEYS = [
    { text: 'quote_1', author: 'Marina Costa', role: 'author_1_role', type: 'testimonial' },
    { text: 'quote_2', author: 'TechCrunch', role: 'author_2_role', type: 'press' },
    { text: 'quote_3', author: '', role: '', type: 'stat' },
    { text: 'quote_4', author: 'Product Hunt', role: 'author_4_role', type: 'press' },
    { text: 'quote_5', author: 'Pedro Henrique', role: 'author_5_role', type: 'testimonial' },
    { text: 'quote_6', author: 'Ana Beatriz', role: 'author_6_role', type: 'testimonial' }
];

export function HeroSection({ onLogin, onShowTerms, onShowPrivacy }: HeroSectionProps) {
    const { t, language, setLanguage } = useLanguage();
    const { isNeobrutalist } = useStyleTheme();
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setFadeState('out');
            setTimeout(() => {
                setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS_KEYS.length);
                setFadeState('in');
            }, 500);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const handleLogin = (provider: string) => {
        if (provider !== 'demo' && !agreedToTerms) return;

        setIsLoading(provider);

        if (provider === 'demo') {
            setTimeout(() => {
                setIsLoading(null);
                onLogin(provider);
            }, 1000);
            return;
        }

        const backendUrl = 'http://localhost:3109';
        if (provider === 'google') {
            window.location.href = `${backendUrl}/auth/google`;
        } else if (provider === 'microsoft') {
            window.location.href = `${backendUrl}/auth/microsoft`;
        }
    };

    const testimonialKey = TESTIMONIALS_KEYS[currentTestimonial];
    const testimonialText = t(`landing.testimonials.${testimonialKey.text}`);
    const testimonialRole = testimonialKey.role ? t(`landing.testimonials.${testimonialKey.role}`) : '';

    return (
        <section className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-400/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-400/5 rounded-full blur-3xl" />
            </div>

            {/* Language Selector - Absolute Top Right */}
            <div className="absolute top-6 right-6 z-50">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white/60 shadow-sm transition-all text-slate-700 font-medium text-sm">
                            <img
                                src={`/images/flags/${language === 'pt' ? 'br' : language === 'en' ? 'us' : 'es'}.svg`}
                                alt={language}
                                className="w-5 h-auto rounded-sm shadow-sm"
                            />
                            <span className="uppercase">{language}</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="min-w-[150px] bg-white rounded-lg shadow-xl p-1 z-50 animate-in slide-in-from-top-2 duration-200">
                            <DropdownMenu.Item
                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer outline-none"
                                onClick={() => setLanguage('pt')}
                            >
                                <img src="/images/flags/br.svg" alt="Portuguese" className="w-5 h-auto rounded-sm shadow-sm" />
                                Português
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer outline-none"
                                onClick={() => setLanguage('en')}
                            >
                                <img src="/images/flags/us.svg" alt="English" className="w-5 h-auto rounded-sm shadow-sm" />
                                English
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer outline-none"
                                onClick={() => setLanguage('es')}
                            >
                                <img src="/images/flags/es.svg" alt="Spanish" className="w-5 h-auto rounded-sm shadow-sm" />
                                Español
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
                <div className="w-full max-w-7xl grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">

                    {/* Left Side - Login (2/5) */}
                    <div className="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                        {/* Logo */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                            <img
                                src="/ratel.svg?v=3"
                                alt="Ratel Logo"
                                className="h-[116px] w-[116px] sm:h-[120px] sm:w-[120px] object-contain drop-shadow-lg translate-y-[20px] sm:translate-y-0"
                            />
                            <img
                                src="/name-ratel.svg?v=3"
                                alt="Ratel"
                                className="h-16 sm:h-[84px] object-contain mt-2 sm:mt-0"
                            />
                        </div>

                        {/* Tagline */}
                        <p className="text-xl text-slate-600 mb-8 max-w-sm mx-auto lg:mx-0">
                            {t('landing.hero.title')} {t('landing.hero.subtitle')}
                        </p>

                        {/* Login Card - Theme-aware */}
                        <div className={`w-full max-w-[90vw] sm:max-w-sm p-4 sm:p-6 mx-auto lg:mx-0 ${isNeobrutalist
                            ? 'bg-white border-4 border-black shadow-[8px_8px_0_0_#000]'
                            : 'rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/50'
                            }`}>
                            {/* Terms */}
                            <div className={`flex items-start gap-3 p-3 mb-5 ${isNeobrutalist
                                ? 'bg-gray-100 border-2 border-black'
                                : 'rounded-xl bg-slate-100/80'
                                }`}>
                                <input
                                    type="checkbox"
                                    id="terms-hero"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="terms-hero" className="text-sm text-slate-600">
                                    {t('landing.hero.terms_privacy_prefix')}{' '}
                                    <button onClick={onShowTerms} className="text-blue-600 hover:underline font-medium">
                                        {t('landing.hero.terms')}
                                    </button>{' '}
                                    {t('landing.hero.and')}{' '}
                                    <button onClick={onShowPrivacy} className="text-blue-600 hover:underline font-medium">
                                        {t('landing.hero.privacy')}
                                    </button>
                                </label>
                            </div>

                            {/* Google Button */}
                            <Button
                                variant="outline"
                                size="lg"
                                className={`w-full h-12 text-base mb-3 transition-all duration-300 ${isNeobrutalist
                                    ? 'bg-white border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] font-bold'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                onClick={() => handleLogin('google')}
                                disabled={!!isLoading || !agreedToTerms}
                            >
                                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                {isLoading === 'google' ? <Loader2 className="h-5 w-5 animate-spin" /> : t('landing.hero.login_google')}
                            </Button>

                            {/* Microsoft Button */}
                            <Button
                                variant="outline"
                                size="lg"
                                className={`w-full h-12 text-base mb-4 transition-all duration-300 ${isNeobrutalist
                                    ? 'bg-white border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] font-bold'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                onClick={() => handleLogin('microsoft')}
                                disabled={!!isLoading || !agreedToTerms}
                            >
                                <svg className="mr-3 h-5 w-5" viewBox="0 0 23 23">
                                    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                                    <path fill="#f35325" d="M1 1h10v10H1z" />
                                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                                </svg>
                                {isLoading === 'microsoft' ? <Loader2 className="h-5 w-5 animate-spin" /> : t('landing.hero.login_microsoft')}
                            </Button>

                            {/* Divider */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/60 px-2 text-slate-400">{t('landing.hero.or')}</span>
                                </div>
                            </div>

                            {/* Demo Button */}
                            <Button
                                size="lg"
                                className={`w-full h-12 text-base transition-all duration-300 ${isNeobrutalist
                                        ? 'bg-[#E63946] border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] text-white font-black'
                                        : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5'
                                    }`}
                                onClick={() => handleLogin('demo')}
                                disabled={!!isLoading}
                            >
                                {isLoading === 'demo' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    t('landing.hero.demo_button')
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Right Side - Testimonials Carousel (3/5) */}
                    <div className="lg:col-span-3 flex items-center justify-center">
                        <div className="w-full max-w-xl p-8 lg:p-12 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl shadow-slate-200/50">
                            <div
                                className={`transition-all duration-500 ${fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            >
                                {/* Quote */}
                                <p className="text-2xl lg:text-3xl font-light text-slate-700 leading-relaxed mb-8">
                                    "{testimonialText}"
                                </p>

                                {/* Author */}
                                {testimonialKey.author && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                                            {testimonialKey.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{testimonialKey.author}</p>
                                            <p className="text-sm text-slate-500">{testimonialRole}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dots Indicator */}
                            <div className="flex justify-center gap-2 mt-8">
                                {TESTIMONIALS_KEYS.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setFadeState('out');
                                            setTimeout(() => {
                                                setCurrentTestimonial(index);
                                                setFadeState('in');
                                            }, 300);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTestimonial
                                            ? 'bg-blue-600 w-6'
                                            : 'bg-slate-300 hover:bg-slate-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-sm text-slate-400">{t('landing.hero.discover_more')}</span>
                <ChevronDown className="h-5 w-5 text-slate-400" />
            </div>
        </section>
    );
}
