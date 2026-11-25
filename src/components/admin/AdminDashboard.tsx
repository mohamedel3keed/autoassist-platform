import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Layers,
  Bot,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { t } from '../../i18n/translations';
import { AdminSection } from '../../types/platform';
import { AdminOverview } from './AdminOverview';
import { AdminUsers, AdminProviders } from './AdminUsersAndProviders';
import { AdminPlatformManage, AdminAiMonitoring } from './AdminPlatformAndAi';

export const AdminDashboard: React.FC = () => {
  const { lang, adminSection, setAdminSection, providers } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingProviders = providers.filter((p) => p.verificationStatus === 'pending').length;

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: t(lang, 'adminOverview'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: t(lang, 'adminUsers'), icon: <Users className="w-4 h-4" /> },
    {
      id: 'providers',
      label: t(lang, 'adminProviders'),
      icon: <Building2 className="w-4 h-4" />,
      badge: pendingProviders > 0 ? pendingProviders : undefined,
    },
    { id: 'platform', label: t(lang, 'adminPlatform'), icon: <Layers className="w-4 h-4" /> },
    { id: 'ai_monitoring', label: t(lang, 'adminAiMonitoring'), icon: <Bot className="w-4 h-4" /> },
  ];

  const currentLabel = navItems.find((n) => n.id === adminSection)?.label || t(lang, 'adminOverview');

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] flex max-w-[1440px] mx-auto">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 bg-white border-e border-slate-200 p-4 justify-between">
        <div className="space-y-6">
          <div className="p-3.5 rounded-xl bg-[#172B3A] text-white flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#DCEFEF] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-[#DCEFEF]">{t(lang, 'brandName')}</p>
              <p className="text-sm font-bold truncate">{t(lang, 'roleAdmin')}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = adminSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAdminSection(item.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#DCEFEF] text-[#0F766E] font-semibold'
                      : 'text-[#64748B] hover:bg-slate-50 hover:text-[#172B3A]'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <p className="text-[11px] text-[#64748B] leading-snug pt-4 border-t border-slate-100">
          {t(lang, 'demoNotice')}
        </p>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-[#172B3A]/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-white h-full p-4 z-10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-[#172B3A]">{t(lang, 'roleAdmin')}</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setAdminSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    adminSection === item.id
                      ? 'bg-[#DCEFEF] text-[#0F766E] font-semibold'
                      : 'text-[#64748B]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="text-xs font-mono font-bold text-amber-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 h-13 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-[#172B3A]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm truncate">
              <span className="text-[#64748B]">{t(lang, 'roleAdmin')}</span>
              <span className="text-[#64748B]">/</span>
              <span className="font-bold text-[#172B3A] truncate">{currentLabel}</span>
            </div>
          </div>

          <span className="text-xs font-medium text-[#0F766E] bg-[#DCEFEF] px-2.5 py-1 rounded-lg whitespace-nowrap">
            {t(lang, 'sampleDataBadge')}
          </span>
        </div>

        <main className="flex-1 p-4 sm:p-6">
          {adminSection === 'overview' && <AdminOverview />}
          {adminSection === 'users' && <AdminUsers />}
          {adminSection === 'providers' && <AdminProviders />}
          {adminSection === 'platform' && <AdminPlatformManage />}
          {adminSection === 'ai_monitoring' && <AdminAiMonitoring />}
        </main>
      </div>
    </div>
  );
};
