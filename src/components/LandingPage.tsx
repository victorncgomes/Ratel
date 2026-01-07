import { HeroSection } from './landing/HeroSection';
import { PhilosophySection } from './landing/PhilosophySection';
import { FeaturesSection } from './landing/FeaturesSection';

import { TestimonialsSection } from './landing/TestimonialsSection';
import { FooterSection } from './landing/FooterSection';

interface LandingPageProps {
    onLogin: (provider?: string) => void;
    onShowTerms?: () => void;
    onShowPrivacy?: () => void;
}

export function LandingPage({ onLogin, onShowTerms, onShowPrivacy }: LandingPageProps) {
    const handleLogin = (provider: string) => {
        // If demo, just call onLogin directly
        if (provider === 'demo') {
            onLogin();
            return;
        }
        // For OAuth, the HeroSection handles redirect
        onLogin(provider);
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Section 1: Hero with Login */}
            <HeroSection
                onLogin={handleLogin}
                onShowTerms={onShowTerms}
                onShowPrivacy={onShowPrivacy}
            />

            {/* Section 2: Philosophy */}
            <PhilosophySection />

            {/* Section 3a: Features (Part 1 - Até 'Não Me Perturbe Mais') */}
            <FeaturesSection rangeEnd={4} />

            {/* Section 4: Testimonials (Intercalado) */}
            <TestimonialsSection />

            {/* Section 3b: Features (Part 2 - 'Compras' e 'Newsletters') */}
            <FeaturesSection rangeStart={4} />

            {/* Section 6: Footer with image only */}
            <FooterSection />
        </div>
    );
}
