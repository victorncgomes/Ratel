import { useState, useEffect } from 'react';
import { PageHeader } from '../ui/PageHeader';
import { ShieldAlert, CheckCircle, Star } from 'lucide-react';
import { useStyleTheme } from '../../contexts/StyleThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { RulesList } from './RulesPage';
import { useRules } from '../../hooks/useRules';
import { useEmails } from '../../hooks/useEmails';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/badge';
import { showToast } from '../../lib/toast';

export function ProtectionPage() {
    const { isNeobrutalist } = useStyleTheme();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'blocked' | 'safe' | 'important'>('blocked');

    // Hooks
    const { rules, fetchRules, removeRule, addToShield } = useRules();
    const { emails, updateEmail } = useEmails();

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    // Derived Data
    const blockedRules = rules.filter(r => r.type === 'shield');
    // Mocking "Safe" list from emails marked as safe or we could add a new rule type 'safe'
    // For now, let's list emails with isMarkedSafe=true
    const safeEmails = emails.filter(e => e.isMarkedSafe);
    const importantEmails = emails.filter(e => e.isImportant);

    const handleRemoveRule = async (sender: string) => {
        try {
            await removeRule(sender);
            showToast(t('protection_page.rule_removed'), 'success');
        } catch (e) {
            showToast(t('protection_page.error_removing'), 'error');
        }
    };

    const stats = [
        {
            label: t('protection_page.threats_blocked'),
            value: blockedRules.length,
            icon: ShieldAlert,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        },
        {
            label: t('protection_page.safe_senders'),
            value: safeEmails.length,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            label: t('protection_page.marked_important'),
            value: importantEmails.length,
            icon: Star,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        }
    ];

    const handleAddToShield = async (sender: string, emailId?: string) => {
        try {
            await addToShield(sender);
            // Also remove from safe/important if applicable
            if (emailId) {
                await updateEmail(emailId, { isMarkedSafe: false, isImportant: false });
            }
            showToast(`${sender} ${t('protection_page.blocked_added')}`, 'success');
        } catch (e) {
            showToast(t('protection_page.error_blocking'), 'error');
        }
    };

    const handleRemoveFromSafe = async (emailId: string) => {
        await updateEmail(emailId, { isMarkedSafe: false });
        showToast(t('protection_page.removed_from_safe'), 'success');
    };

    const handleNotImportant = async (emailId: string) => {
        await updateEmail(emailId, { isImportant: false });
        showToast(t('protection_page.marked_not_important'), 'success');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title={t('protection_page.title')}
                description={t('protection_page.description')}
                stats={stats}
            />

            {/* Tabs */}
            <div className={`mt-6 border-b ${isNeobrutalist ? 'border-4 border-black' : 'border-gray-200'}`}>
                <div className="flex overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('blocked')}
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all whitespace-nowrap ${activeTab === 'blocked'
                            ? 'border-red-500 text-red-600 font-bold bg-red-50'
                            : 'border-transparent text-muted-foreground hover:bg-secondary'
                            }`}
                    >
                        <ShieldAlert className="h-4 w-4" />
                        {t('protection_page.tab_blocked')}
                    </button>
                    <button
                        onClick={() => setActiveTab('safe')}
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all whitespace-nowrap ${activeTab === 'safe'
                            ? 'border-green-500 text-green-600 font-bold bg-green-50'
                            : 'border-transparent text-muted-foreground hover:bg-secondary'
                            }`}
                    >
                        <CheckCircle className="h-4 w-4" />
                        {t('protection_page.tab_safe')}
                    </button>
                    <button
                        onClick={() => setActiveTab('important')}
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all whitespace-nowrap ${activeTab === 'important'
                            ? 'border-yellow-500 text-yellow-600 font-bold bg-yellow-50'
                            : 'border-transparent text-muted-foreground hover:bg-secondary'
                            }`}
                    >
                        <Star className="h-4 w-4" />
                        {t('protection_page.tab_important')}
                    </button>
                </div>
            </div>

            {/* Content Content */}
            <div className="min-h-[300px]">
                {activeTab === 'blocked' && (
                    <RulesList
                        type="shield"
                        rules={blockedRules}
                        onRemove={handleRemoveRule}
                        isNeobrutalist={isNeobrutalist}
                    />
                )}

                {activeTab === 'safe' && (
                    <div className="grid grid-cols-1 gap-4">
                        {safeEmails.length === 0 ? (
                            <Card className="border-dashed flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 bg-green-100 rounded-full mb-4 text-green-600">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                                <h3 className="font-semibold text-xl">{t('protection_page.no_safe_sender')}</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                                    {t('protection_page.no_safe_sender_desc')}
                                </p>
                            </Card>
                        ) : (
                            // Unique senders from safe emails
                            // Note: Since we are listing emails now to allow actions per-email, we might have duplicates if valid
                            // But for "Remetentes Seguros" conceptually we want unique senders.
                            // If we just act on the first email found for that sender it might be confusing if multiple exist.
                            // Simpler approach: List emails that triggered 'safe' or treat them as sender rules?
                            // The prompt asked for "Enhance... to allow actions".
                            // I'll list unique senders and find ONE emailId to use for unmarking (or ideally unmark all from that sender).
                            // For simplicity/mock I'll just iterate emails for now or group them.
                            // Let's iterate unique senders and find matching emails to update.
                            Array.from(new Set(safeEmails.map(e => e.from))).map(sender => {
                                const relatedEmail = safeEmails.find(e => e.from === sender);
                                return (
                                    <Card key={sender} className={`overflow-hidden ${isNeobrutalist ? 'border-2 border-black shadow-[4px_4px_0_0_#000]' : ''}`}>
                                        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 text-green-600 rounded">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">{sender}</span>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 mr-auto sm:mr-0">{t('protection_page.safe')}</Badge>
                                                {relatedEmail && (
                                                    <button
                                                        onClick={() => handleRemoveFromSafe(relatedEmail.id)}
                                                        className="text-sm text-gray-500 hover:text-red-500 underline"
                                                    >
                                                        {t('protection_page.remove')}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAddToShield(sender, relatedEmail?.id)}
                                                    className="text-sm font-bold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded"
                                                >
                                                    {t('protection_page.block')}
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        )}
                    </div>
                )}

                {activeTab === 'important' && (
                    <div className="space-y-4">
                        {importantEmails.length === 0 ? (
                            <Card className="border-dashed flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 bg-yellow-100 rounded-full mb-4 text-yellow-600">
                                    <Star className="h-8 w-8" />
                                </div>
                                <h3 className="font-semibold text-xl">{t('protection_page.no_important_email')}</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                                    {t('protection_page.no_important_email_desc')}
                                </p>
                            </Card>
                        ) : (
                            importantEmails.map(email => (
                                <Card key={email.id} className={`overflow-hidden transition-all hover:bg-gray-50 ${isNeobrutalist ? 'border-2 border-black shadow-[4px_4px_0_0_#000]' : 'hover:shadow-sm'}`}>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-base">{email.from}</h4>
                                                <p className="font-medium text-sm mb-1">{email.subject}</p>
                                            </div>
                                            <div className="flex items-center gap-2 self-start">
                                                {email.aiScore && (
                                                    <Badge className={
                                                        email.aiScore > 80 ? 'bg-green-500' :
                                                            email.aiScore > 50 ? 'bg-yellow-500' : 'bg-gray-500'
                                                    }>
                                                        AI: {email.aiScore}
                                                    </Badge>
                                                )}
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(email.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{email.snippet}</p>

                                        <div className="flex items-center justify-between mt-3">
                                            {email.aiReason ? (
                                                <div className="p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 flex items-start gap-2 max-w-[70%]">
                                                    <Star className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                    <span>{email.aiReason}</span>
                                                </div>
                                            ) : <div></div>}

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleNotImportant(email.id)}
                                                    className="text-xs font-semibold text-gray-500 hover:text-gray-900 border px-2 py-1 rounded"
                                                >
                                                    {t('protection_page.not_important')}
                                                </button>
                                                <button
                                                    onClick={() => handleAddToShield(email.from, email.id)}
                                                    className="text-xs font-semibold text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded border border-red-100"
                                                >
                                                    {t('protection_page.block')}
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
