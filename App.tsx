import React, { useState } from 'react';
import { Header, Sidebar } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { SubscriptionCenter } from './components/SubscriptionCenter';
import { LabelManager } from './components/LabelManager';
import { ActivityLog } from './components/ActivityLog';
import { SmartAssistant } from './components/SmartAssistant';
import { MailProvider } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [provider] = useState<MailProvider>(MailProvider.HOTMAIL);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'subscriptions':
        return <SubscriptionCenter />;
      case 'labels':
        return <LabelManager />;
      case 'activity':
        return <ActivityLog />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center text-4xl">
              🚧
            </div>
            <h2 className="text-2xl font-bold">Funcionalidade em Desenvolvimento</h2>
            <p className="text-muted-foreground max-w-md">
              Estamos trabalhando para trazer esta seção para você!
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Voltar ao Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        provider={provider}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id);
          setIsSidebarOpen(false);
        }}
      />

      <main className="pt-16 md:pl-64 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <SmartAssistant />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
