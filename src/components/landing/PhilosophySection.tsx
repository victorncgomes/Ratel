import { useIntersectionObserver } from '../../hooks/useLandingAnimations';
import { useStyleTheme } from '../../contexts/StyleThemeContext';

export function PhilosophySection() {
    const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.2 });
    const { isNeobrutalist } = useStyleTheme();

    return (
        <section
            ref={ref}
            className={`relative py-24 lg:py-32 ${isNeobrutalist ? 'bg-white' : 'bg-gradient-to-b from-white to-slate-50'}`}
        >
            {/* Content */}
            <div className="max-w-4xl mx-auto px-6">
                <div
                    className={`text-center transition-all duration-1000 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-8">
                        A Filosofia Ratel
                    </h2>

                    <div className="space-y-6 text-lg lg:text-xl text-slate-600 leading-relaxed">
                        <p>
                            <strong className="text-blue-600">Seu tempo é precioso demais</strong> para ser
                            desperdiçado gerenciando newsletters, promoções e spam. Criamos o Ratel para
                            devolver a você o controle da sua caixa de entrada.
                        </p>

                        <p>
                            Assim como o animal que nos inspira — o Ratel, conhecido por ser corajoso e
                            implacável — nossa ferramenta <strong className="text-blue-600">não tem medo de
                                atacar o caos</strong> da sua inbox.
                        </p>

                        <p>
                            Com inteligência artificial de ponta e uma interface que respeita sua
                            atenção, transformamos a tarefa árdua de limpar emails em uma
                            <strong className="text-blue-600"> experiência satisfatória</strong>.
                        </p>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8">
                        <div className={`flex items-center gap-3 ${isNeobrutalist ? 'text-black' : 'text-slate-700'}`}>
                            <div className={`w-14 h-14 transition-all flex items-center justify-center ${isNeobrutalist
                                    ? 'bg-blue-100 border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none'
                                    : 'rounded-2xl bg-blue-100'
                                }`}>
                                <span className="text-2xl">🧠</span>
                            </div>
                            <span className="font-medium">IA Gemini</span>
                        </div>
                        <div className={`flex items-center gap-3 ${isNeobrutalist ? 'text-black' : 'text-slate-700'}`}>
                            <div className={`w-14 h-14 transition-all flex items-center justify-center ${isNeobrutalist
                                    ? 'bg-green-100 border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none'
                                    : 'rounded-2xl bg-green-100'
                                }`}>
                                <span className="text-2xl">⚡</span>
                            </div>
                            <span className="font-medium">Limpeza Instantânea</span>
                        </div>
                        <div className={`flex items-center gap-3 ${isNeobrutalist ? 'text-black' : 'text-slate-700'}`}>
                            <div className={`w-14 h-14 transition-all flex items-center justify-center ${isNeobrutalist
                                    ? 'bg-violet-100 border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none'
                                    : 'rounded-2xl bg-violet-100'
                                }`}>
                                <span className="text-2xl">🔒</span>
                            </div>
                            <span className="font-medium">100% Seguro</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
