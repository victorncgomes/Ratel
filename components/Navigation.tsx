import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';
import { NAV_ITEMS, FOOTER_ITEMS, MOCK_NOTIFICATIONS } from '../constants';
import { MailProvider } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  provider: MailProvider;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, provider }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifyRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="md:hidden p-2 rounded-lg hover:bg-secondary">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/ratel.svg" alt="Ratel" style={{ width: '32px', height: '32px' }} />
          <img src="/name-ratel.svg" alt="Ratel" style={{ height: '25.6px' }} />
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Pesquisar emails..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-input focus:border-ring outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <div className="relative" ref={notifyRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="p-2 rounded-lg hover:bg-secondary relative"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <span className="font-semibold text-sm">Notificações</span>
                <button className="text-xs text-primary hover:underline">Limpar</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-secondary border-b border-border last:border-0 cursor-pointer">
                    <div className="flex gap-3">
                      <div className="mt-1">{n.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">{n.time} atrás</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-secondary"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
              V
            </div>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b border-border text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center text-primary-foreground text-xl font-bold mb-2">
                  V
                </div>
                <h4 className="font-semibold">Victor Ratel</h4>
                <p className="text-xs text-muted-foreground mt-1">victor@outlook.com</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-secondary">
                  <User size={18} /> Perfil
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-secondary">
                  <Settings size={18} /> Configurações
                </button>
                <div className="h-px bg-border my-1 mx-2" />
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                  <LogOut size={18} /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export const Sidebar: React.FC<{ isOpen: boolean, activeTab: string, onTabChange: (id: string) => void }> = ({
  isOpen,
  activeTab,
  onTabChange
}) => {
  return (
    <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-background border-r border-border transition-transform duration-300 z-40 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-3 flex flex-col h-full overflow-y-auto">
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-3 border-t border-border space-y-1">
          {FOOTER_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="p-3 mt-3 bg-secondary rounded-lg border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Armazenamento</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary w-[78%]" />
            </div>
            <p className="text-xs font-medium">11.7 GB de 15 GB</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
