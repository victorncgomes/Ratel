import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/input';
import {
    Search, Book, MessageCircle, FileQuestion, History,
    Users, ChevronRight, Mail, Globe
} from 'lucide-react';

type TabType = 'docs' | 'changelog' | 'about' | 'faq';

interface Release {
    version: string;
    date: string;
    type: 'minor' | 'patch';
    changes: string[];
}

interface FaqItem {
    q: string;
    a: string;
}

export function HelpPage() {
    const { t } = useLanguage();
    const { isNeobrutalist } = useStyleTheme();
    const [activeTab, setActiveTab] = useState<TabType>('docs');

    // Fetch dynamic data from translation files
    const releases = t<Release[]>('help_page.releases');
    const faqs = t<FaqItem[]>('help_page.faqs');

    const tabs = [
        { id: 'docs', label: 'Documentação', icon: Book },
        { id: 'changelog', label: t('help_page.changelog'), icon: History },
        { id: 'about', label: 'Sobre', icon: Users },
        { id: 'faq', label: t('help_page.faq'), icon: FileQuestion },
    ] as const;

    const handleSupport = () => {
        window.open('mailto:suporte@paranaue.dev?subject=Suporte Ratel', '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-4 py-8">
                <h2 className="text-4xl font-heading font-black tracking-tight">{t('help_page.title')}</h2>
                <p className="text-muted-foreground">{t('help_page.subtitle')}</p>
                <div className="max-w-md mx-auto relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        className="pl-10 h-12 text-lg shadow-sm focus:shadow-md transition-all"
                        placeholder={t('help_page.search_placeholder')}
                        autoFocus
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className={`flex gap-2 pb-2 overflow-x-auto ${isNeobrutalist ? 'border-b-4 border-black' : 'border-b border-border'}`}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? 'default' : 'ghost'}
                            className={`gap-2 whitespace-nowrap transition-all
                                ${isNeobrutalist
                                    ? `font-bold border-2 border-black ${activeTab === tab.id ? 'shadow-[3px_3px_0_0_#000] bg-[#E63946] text-white' : 'shadow-[2px_2px_0_0_#000]'}`
                                    : `${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'} rounded-full`
                                }
                            `}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </Button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {/* Documentação */}
                {activeTab === 'docs' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid gap-4">
                            {[
                                { title: t('help_page.quick_access.title'), desc: t('help_page.quick_access.description'), icon: '🚀' },
                                { title: t('help_page.topics.subscriptions.title'), desc: t('help_page.topics.subscriptions.desc'), icon: '📬' },
                                { title: t('help_page.topics.labels.title'), desc: t('help_page.topics.labels.desc'), icon: '🏷️' },
                                { title: t('help_page.topics.settings.title'), desc: t('help_page.topics.settings.desc'), icon: '⚙️' },
                                { title: t('help_page.topics.shortcuts.title'), desc: t('help_page.topics.shortcuts.desc'), icon: '⌨️' },
                            ].map((doc, i) => (
                                <Card key={i} className={`cursor-pointer group transition-all ${isNeobrutalist
                                    ? 'hover:shadow-[6px_6px_0_0_#000] border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none'
                                    : 'hover:shadow-md hover:-translate-y-1'
                                    }`}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{doc.icon}</span>
                                            <div>
                                                <h4 className="font-semibold group-hover:text-primary transition-colors">{doc.title}</h4>
                                                <p className="text-sm text-muted-foreground">{doc.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Changelog */}
                {activeTab === 'changelog' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{t('help_page.changelog')}</h3>
                            <span className="text-sm text-muted-foreground">{t('help_page.version')}: 0.2.13</span>
                        </div>
                        <div className="space-y-4">
                            {Array.isArray(releases) && releases.map((release) => (
                                <Card key={release.version} className={
                                    isNeobrutalist
                                        ? `border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none ${release.type === 'minor' ? 'bg-primary/5' : 'bg-white'}`
                                        : `${release.type === 'minor' ? 'border-primary/50 bg-primary/5' : ''}`
                                }>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                v{release.version}
                                                {release.type === 'minor' && (
                                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">RELEASE</span>
                                                )}
                                            </CardTitle>
                                            <CardDescription>{release.date}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-1">
                                            {release.changes.map((change, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="text-primary mt-1">•</span>
                                                    {change}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quem Somos */}
                {activeTab === 'about' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <Card className={`overflow-hidden ${isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none' : ''}`}>
                            <div className="bg-gradient-to-r from-primary to-fluent-purple p-8 text-white">
                                <h3 className="text-3xl font-heading font-bold mb-2">{t('help_page.paranaue.title')}</h3>
                                <p className="text-lg opacity-90">{t('help_page.paranaue.subtitle')}</p>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                {/* Logo Paranaue */}
                                <div className="flex justify-center py-4">
                                    <img
                                        src="/paranaue.svg"
                                        alt="Paranaue - Desenvolvedora"
                                        className="h-16 w-auto dark:invert opacity-80 hover:opacity-100 transition-opacity"
                                    />
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t('help_page.paranaue.description1')}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t('help_page.paranaue.description2')}
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button variant="outline" className="gap-2" onClick={() => window.open('https://paranaue.dev', '_blank')}>
                                        <Globe className="h-4 w-4" />
                                        paranaue.dev
                                    </Button>
                                    <Button variant="outline" className="gap-2" onClick={() => window.open('mailto:contato@paranaue.dev', '_blank')}>
                                        <Mail className="h-4 w-4" />
                                        contato@paranaue.dev
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* FAQ */}
                {activeTab === 'faq' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        {Array.isArray(faqs) && faqs.map((item, i) => (
                            <Card key={i} className={isNeobrutalist ? 'border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none' : ''}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-start gap-2">
                                        <FileQuestion className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        {item.q}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground pl-7">{item.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Support CTA */}
            <div className={isNeobrutalist
                ? "border-4 border-black shadow-[6px_6px_0_0_#000] p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-white"
                : "rounded-xl border border-border bg-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
            }>
                <div>
                    <h3 className={`text-xl mb-2 ${isNeobrutalist ? 'font-black' : 'font-semibold'}`}>{t('help_page.need_help.title')}</h3>
                    <p className="text-muted-foreground">{t('help_page.need_help.description')}</p>
                </div>
                <Button size="lg" className={isNeobrutalist
                    ? "gap-2 font-bold border-4 border-black shadow-[4px_4px_0_0_#000] bg-[#E63946] text-white hover:shadow-[6px_6px_0_0_#000]"
                    : "gap-2"
                } onClick={handleSupport}>
                    <MessageCircle className="h-5 w-5" />
                    {t('help_page.contact')}
                </Button>
            </div>
        </div>
    );
}
