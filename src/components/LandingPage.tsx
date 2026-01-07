import { HeroSection } from './landing/HeroSection';
import { PhilosophySection } from './landing/PhilosophySection';
import { FeaturesSection } from './landing/FeaturesSection';


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

            {/* Section 3: Features */}
            <FeaturesSection />

            {/* Section 4: Stats 
            <StatsSection /> -- Removed as it is now integrated into FeaturesSection */}



            {/* Section 6: Footer with image only */}
            <FooterSection />
        </div>
    );
}
