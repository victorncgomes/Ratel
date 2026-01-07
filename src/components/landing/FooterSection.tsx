

export function FooterSection() {
    return (
        // Changed bg-white to bg-slate-50 to match the end of TestimonialsSection gradient for seamless blending.
        // The image's transparency will now reveal this matching background.
        <footer className="relative w-full mt-[-1px] bg-slate-50">
            <div className="relative w-full">
                {/* 
                   Seamless Integration using CSS Mask
                   This fades the top 20% of the image into transparency,
                   allowing the white background to show through perfectly.
                */}
                <img
                    src="/images/bottom_image_integrated.png?v=2"
                    alt="Ratel observando o horizonte"
                    width="1920"
                    height="600"
                    className="w-full block"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        imageRendering: 'auto'
                    }}
                    loading="eager"
                    fetchPriority="high"
                />
            </div>

            {/* Micro-line Separator */}
            <div className="w-full h-px bg-white/10 relative z-10" />

            {/* Black Footer Bar */}
            <div className="bg-[#0f0f0f] w-full py-8 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <img
                        src="/ratel-logo-negative.svg?v=2"
                        alt="Ratel"
                        width="100"
                        height="32"
                        className="h-8 opacity-60 grayscale hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-4 text-sm">
                            <a
                                href="/terms"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Termos de Serviço
                            </a>
                            <span className="text-gray-600">|</span>
                            <a
                                href="/privacy"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Privacidade
                            </a>
                        </div>
                        <p className="text-gray-500 text-sm text-center sm:text-right font-medium">
                            © {new Date().getFullYear()} Ratel. Developed by Paranaue.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
