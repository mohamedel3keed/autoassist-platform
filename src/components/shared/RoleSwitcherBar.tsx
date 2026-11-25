import React from 'react';
import { Car, Wrench, ShieldCheck, Globe, UserPlus } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { t } from '../../i18n/translations';
import { UserRole } from '../../types/platform';

export const RoleSwitcherBar: React.FC = () => {
  const { lang, toggleLang, role, setRole, setOnboardingOpen } = usePlatform();

  const roles: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    { id: 'car_owner', label: t(lang, 'roleCarOwner'), icon: <Car className="w-4 h-4 shrink-0" /> },
    { id: 'provider', label: t(lang, 'roleProvider'), icon: <Wrench className="w-4 h-4 shrink-0" /> },
    { id: 'admin', label: t(lang, 'roleAdmin'), icon: <ShieldCheck className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-[#172B3A] whitespace-nowrap">
            {t(lang, 'brandName')}
          </span>
        </div>

        {/* Zone 2: Demo Role Switcher */}
        <nav
          aria-label="Workspace role switcher"
          className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
        >
          {roles.map((r) => {
            const active = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#172B3A] shadow-sm'
                    : 'text-[#64748B] hover:text-[#172B3A]'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher & Onboarding Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setOnboardingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-[#172B3A] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
            <span className="hidden sm:inline">{t(lang, 'onboardingBtn')}</span>
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DCEFEF] hover:bg-[#cbe6e6] text-[#0F766E] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>{t(lang, 'languageLabel')}</span>
          </button>
        </div>
      </div>

      {/* Mobile compact role switcher row */}
      <div className="md:hidden border-t border-slate-100 px-3 py-1.5 bg-[#F8FAFC] flex items-center gap-1 overflow-x-auto">
        {roles.map((r) => {
          const active = role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer min-h-[36px] ${
                active
                  ? 'bg-[#0F766E] text-white'
                  : 'bg-white border border-slate-200 text-[#64748B]'
              }`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
