export const en = {
    common: {
        search_placeholder: 'Search emails, contacts or labels... (Ctrl+K)',
        notifications: 'Notifications',
        settings: 'Settings',
        help: 'Help',
        profile: 'Profile',
        logout: 'Logout',
        storage: 'Storage',
        storage_used: 'used',
        support: 'Support',
        main_menu: 'Main Menu',
        user: 'User',
        back_to_home: 'Back to Home',
        open: 'Open',
        actions: 'Actions',
        cancel: 'Cancel',
        confirm: 'Confirm',
    },
    menu: {
        dashboard: 'Dashboard',
        subscriptions: 'Subscriptions',
        labels: 'Labels',
        activity: 'Activity',
    },
    dashboard: {
        received_emails: 'Received Emails',
        reading_time: 'Reading Time',
        response_rate: 'Response Rate',
        spam_blocked: 'Spam Blocked',
        weekly_volume: 'Weekly Volume',
        categories: 'Categories',
        hourly_activity: 'Hourly Activity',
        inbox_health: 'Inbox Health',
        vs_last_week: 'vs last week',
        estimated_daily_avg: 'Estimated daily avg',
        better_than_avg: 'better than avg',
        last_30_days: 'Last 30 days',
        processed_emails_7_days: 'Emails processed in the last 7 days',
        distribution_received: 'Distribution of received emails',
        peak_reception: 'Peak email reception',
        current_status: 'Current status of your organization',
        inbox_zero: 'Inbox Zero',
        keeping_rhythm: 'You are keeping the rhythm!',
        fast_responses: 'Fast Responses',
        avg_time_2h: 'Avg time < 2h',
        week_days: {
            seg: 'Mon',
            ter: 'Tue',
            qua: 'Wed',
            qui: 'Thu',
            sex: 'Fri',
            sab: 'Sat',
            dom: 'Sun',
        },
        categories_names: {
            work: 'Work',
            social: 'Social',
            promotions: 'Promotions',
            updates: 'Updates',
        }
    },
    labels_page: {
        title: 'Your Labels',
        subtitle: 'Organize your emails with smart tags.',
        organize_with_ia: 'Organize with AI',
        new_label: 'New Label',
        ia_card: {
            title: 'Smart Organization',
            description: 'Our AI analyzes your email content and suggests labels automatically.',
            unclassified: 'Unclassified emails',
            accuracy: 'AI Accuracy',
            active_labels: 'Active labels',
            organized_today: 'Emails organized today',
        },
        labels_list: {
            important: 'Important',
            work: 'Work',
            finance: 'Finance',
            travel: 'Travel',
            projects: 'Projects',
            personal: 'Personal',
        }
    },
    activity_page: {
        title: 'Recent Activity',
        subtitle: 'Track latest actions in your account.',
        filter_all: 'All',
        filter_emails: 'Emails',
        filter_system: 'System',
        filter_security: 'Security',
        items: {
            replied: 'Replied email',
            archived: 'Archived',
            deleted_permanent: 'Permanently deleted',
            forwarded: 'Forwarded attachment',
            new_subscription: 'New Subscription',
            login_detected: 'New login detected',
            system_update: 'System Update',
        },
        time: {
            min_ago: 'min ago',
            hour_ago: 'hour ago',
            hours_ago: 'hours ago',
            yesterday: 'yesterday',
        }
    },
    notifications_page: {
        title: 'Notifications',
        subtitle: 'Manage your alerts and important notices.',
        mark_all_read: 'Mark all as read',
        mark_read: 'Mark as read',
        empty: 'No new notifications',
        items: {
            login: {
                title: 'New login detected',
                description: 'A new login was performed on "Chrome on Windows".',
            },
            inbox_zero: {
                title: 'Inbox Zero goal reached!',
                description: 'Congratulations! You cleared your inbox 3 days in a row.',
            },
            update: {
                title: 'System Update',
                description: 'Ratel has been updated to version 0.1.4 with new features.',
            },
            follower: {
                title: 'New follower',
                description: 'Rafael Silva started following your public lists.',
            }
        }
    },
    help_page: {
        title: 'Help Center',
        subtitle: 'Track Ratel updates and improvements',
        version: 'Version',
        changelog: 'Version History',
        faq: 'Frequently Asked Questions',
        contact: 'Contact Support',
        search_placeholder: 'Search help articles...',
        quick_access: {
            title: 'Getting Started',
            description: 'Configure your account and start using',
        },
        topics: {
            subscriptions: { title: 'Managing Subscriptions', desc: 'Organize your newsletters' },
            labels: { title: 'Labels and Organization', desc: 'Categorize your emails with AI' },
            settings: { title: 'Advanced Settings', desc: 'Customize your experience' },
            shortcuts: { title: 'Keyboard Shortcuts', desc: 'Max productivity' },
        },
        need_help: {
            title: 'Still need help?',
            description: 'Our support team is available for you.',
        },
        paranaue: {
            title: 'Paranaue',
            subtitle: 'Applications Developer, Media and Marketing',
            description1: 'Paranaue is a Brazilian company specialized in developing innovative digital solutions. Our objective is to create tools that simplify people\'s lives, combining premium design with cutting-edge technology.',
            description2: 'Ratel was born from the need to manage the chaos of modern inboxes. With artificial intelligence and an intuitive interface, we help you take back control of your emails.',
        },
        faqs: [
            { q: 'How to connect my Gmail account?', a: 'Click "Continue with Google" on the login screen and authorize access.' },
            { q: 'Is it safe to give access to my email?', a: 'Yes! We use OAuth 2.0 and do not store your credentials.' },
            { q: 'How to cancel a subscription?', a: 'Go to Subscriptions, select the item and click "Unsubscribe".' },
            { q: 'Can I use Ratel offline?', a: 'Currently not. Ratel requires internet connection.' },
        ],
        releases: [
            {
                version: '0.3.0', date: '04/01/2026', type: 'major', changes: [
                    '🦡 RATEL FURIOUS: Bulk unsubscribe with lion roar sound effect',
                    '🧹 Functional Cleanup: Real inbox analysis via Gmail/Outlook API',
                    '🎭 Demo Mode: Functional version with mock data without login',
                    '🔧 Labels Fix: Demo mode working correctly',
                    '📊 Advanced Statistics: Real counts and sizes per category',
                    '🗑️ Cleanup Actions: Empty spam and trash with one click'
                ]
            },
            {
                version: '0.2.0', date: '04/01/2026', type: 'minor', changes: [
                    '🧹 New "Cleanup" menu for deep inbox analysis',
                    'Paranaue logo added to About section',
                    'Removed Storage card (unavailable via API)',
                    'Improved newsletter detection with List-Unsubscribe headers'
                ]
            },
            {
                version: '0.1.5', date: '04/01/2026', type: 'minor', changes: [
                    '🧠 Gemini AI integrated for automatic email classification',
                    'Dashboard with 100% real data via Gmail/Outlook API',
                    'New /api/labels/classify route with machine learning',
                    'Colorful charts in Weekly Volume panel'
                ]
            },
            {
                version: '0.1.4', date: '04/01/2026', type: 'minor', changes: [
                    'New premium typography: Nexa font integrated globally',
                    'UI Refinement: Removal of redundant headers',
                    'Responsive improvements: Ratel logo visible on mobile devices',
                    'Font weight adjustments (Extra Bold in titles, Bold in sidebar)'
                ]
            },
            {
                version: '0.1.3', date: '04/01/2026', type: 'patch', changes: [
                    'Real authentication implemented with Google OAuth 2.0',
                    'Real authentication implemented with Microsoft OAuth',
                    'Fixed login loop via URL token + localStorage',
                    'Session persistence between reloads'
                ]
            },
            {
                version: '0.1.2', date: '03/01/2026', type: 'minor', changes: [
                    '📬 Subscriptions page with automatic newsletter detection',
                    'Working actions: Archive, Delete, Unsubscribe',
                    'Smart grouping by sender domain',
                    'Engagement score for each newsletter'
                ]
            },
            {
                version: '0.1.1', date: '03/01/2026', type: 'minor', changes: [
                    '🌍 Complete internationalization system (PT/EN/ES)',
                    'Language selector with custom SVG flags',
                    'Translations for all application pages',
                    'Language preference persistence'
                ]
            },
            {
                version: '0.1.0', date: '02/01/2026', type: 'minor', changes: [
                    '🚀 Initial structure release (Vite + React + TypeScript)',
                    'Layout with collapsible sidebar and fluid navigation',
                    'Design system based on Microsoft Fluent UI',
                    'Reusable UI components (Button, Card, Badge, etc.)'
                ]
            },
            {
                version: '0.0.9', date: '02/01/2026', type: 'patch', changes: [
                    '🌙 Light and dark themes working',
                    'Theme preference persistence in localStorage',
                    'Smooth transition animations between screens',
                    'Micro-interactions on buttons and cards'
                ]
            },
            {
                version: '0.0.8', date: '01/01/2026', type: 'minor', changes: [
                    '📊 Dashboard with interactive charts (Recharts)',
                    'Metric cards: Emails, Reading Time, Spam',
                    'Weekly Volume and Categories charts',
                    'Inbox Health indicator'
                ]
            },
            {
                version: '0.0.7', date: '01/01/2026', type: 'patch', changes: [
                    '👤 Profile/Settings page implemented',
                    'User avatar display via OAuth',
                    'Account options and preferences',
                    'Integration with email provider data'
                ]
            },
            {
                version: '0.0.6', date: '31/12/2025', type: 'minor', changes: [
                    '🔧 Express.js backend initialized',
                    'Passport.js configured for OAuth',
                    'Google and Microsoft authentication routes',
                    'CORS and sessions configured for development'
                ]
            },
            {
                version: '0.0.5', date: '30/12/2025', type: 'patch', changes: [
                    '🦡 "RATEL" concept and naming defined',
                    'Product philosophy documented',
                    'Visual identity and color palette approved',
                    'Manifesto: "What doesn\'t serve, goes. No negotiation."'
                ]
            }
        ]
    }
};
