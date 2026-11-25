import React, { useState } from 'react';
import {
  Home,
  Car,
  Compass,
  History,
  User,
  Bell,
  MapPin,
  Cpu,
  Bot,
  X,
  CheckCheck,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { OwnerTab } from '../../types/platform';

export const OwnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    lang,
    ownerTab,
    setOwnerTab,
    ownerName,
    ownerAvatar,
    ownerLocation,
    setOwnerLocation,
    notifications,
    markAllNotificationsRead,
  } = usePlatform();

  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const primaryNav: { id: OwnerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t(lang, 'navHome'), icon: <Home className="w-5 h-5" /> },
    { id: 'garage', label: t(lang, 'navGarage'), icon: <Car className="w-5 h-5" /> },
    { id: 'explore', label: t(lang, 'navExplore'), icon: <Compass className="w-5 h-5" /> },
    { id: 'history', label: t(lang, 'navHistory'), icon: <History className="w-5 h-5" /> },
    { id: 'profile', label: t(lang, 'navProfile'), icon: <User className="w-5 h-5" /> },
  ];

  const desktopSecondaryNav: { id: OwnerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'ai_chat', label: t(lang, 'diagnoseWithAi'), icon: <Bot className="w-5 h-5" /> },
    { id: 'obd', label: t(lang, 'navObd'), icon: <Cpu className="w-5 h-5" /> },
  ];

  const isNavActive = (id: OwnerTab) => {
    if (id === 'explore' && ownerTab === 'provider_profile') return true;
    if (id === 'history' && ownerTab === 'diagnostic_report') return true;
    return ownerTab === id;
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] flex flex-col lg:flex-row max-w-[1440px] mx-auto">
      {/* Desktop Sidebar Rail */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 bg-white border-e border-slate-200 p-4 justify-between">
        <div className="space-y-6">
          {/* User summary */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            {ownerAvatar ? (
              <img
                src={ownerAvatar}
                alt={ownerName}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#DCEFEF] text-[#0F766E] flex items-center justify-center font-bold text-sm shrink-0">
                {ownerName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#172B3A] truncate">{ownerName}</p>
              <p className="text-xs text-[#64748B] truncate">{t(lang, 'accountCarOwner')}</p>
            </div>
          </div>

          {/* Primary Nav */}
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const active = isNavActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOwnerTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#DCEFEF] text-[#0F766E] font-semibold'
                      : 'text-[#64748B] hover:bg-slate-50 hover:text-[#172B3A]'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 pt-4 space-y-1">
            {desktopSecondaryNav.map((item) => {
              const active = ownerTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOwnerTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#0F766E] text-white font-semibold'
                      : 'text-[#172B3A] hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location & Notifications Footer in Sidebar */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-[#64748B] mb-1">
              {t(lang, 'currentLocationLabel')}
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-[#0F766E] absolute start-3 pointer-events-none" />
              <select
                value={ownerLocation}
                onChange={(e) => setOwnerLocation(e.target.value as 'riyadh' | 'jeddah' | 'dammam')}
                className="w-full ps-9 pe-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#0F766E]"
              >
                <option value="riyadh">{t(lang, 'locationRiyadh')}</option>
                <option value="jeddah">{t(lang, 'locationJeddah')}</option>
                <option value="dammam">{t(lang, 'locationDammam')}</option>
              </select>
            </div>
          </div>
          <p className="text-[11px] text-[#64748B] leading-snug">{t(lang, 'demoNotice')}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Compact Top Sub-bar (Mobile location + notifications; Desktop notifications & quick actions) */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 h-13 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 lg:hidden min-w-0">
            <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
            <select
              value={ownerLocation}
              onChange={(e) => setOwnerLocation(e.target.value as 'riyadh' | 'jeddah' | 'dammam')}
              aria-label={t(lang, 'currentLocationLabel')}
              className="text-xs font-semibold text-[#172B3A] bg-transparent focus:outline-none truncate"
            >
              <option value="riyadh">{t(lang, 'locationRiyadh')}</option>
              <option value="jeddah">{t(lang, 'locationJeddah')}</option>
              <option value="dammam">{t(lang, 'locationDammam')}</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-medium text-[#172B3A]">{t(lang, 'brandTagline')}</span>
            <span aria-hidden="true">·</span>
            <span>
              {ownerLocation === 'riyadh'
                ? t(lang, 'locationRiyadh')
                : ownerLocation === 'jeddah'
                ? t(lang, 'locationJeddah')
                : t(lang, 'locationDammam')}
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setOwnerTab('obd')}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-[#172B3A] text-xs font-medium min-h-[36px] cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>OBD-II</span>
            </button>

            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              aria-label={t(lang, 'notifications')}
              className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#172B3A] cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0F766E] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-12 end-0 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#172B3A]">
                    {t(lang, 'notifications')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#0F766E] hover:underline cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{t(lang, 'markAllRead')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-[#64748B] hover:text-[#172B3A] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-[#64748B] text-center">
                      {t(lang, 'noNotifications')}
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          if (n.targetTab) setOwnerTab(n.targetTab);
                          setNotifOpen(false);
                        }}
                        className={`w-full text-start p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                          n.read ? 'bg-white' : 'bg-[#DCEFEF]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#172B3A]">
                            {bi(n.title, lang)}
                          </span>
                          <span className="text-[11px] text-[#64748B] shrink-0">
                            {bi(n.time, lang)}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                          {bi(n.body, lang)}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Screen Body */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8">{children}</main>
      </div>

      {/* Mobile Fixed Bottom Navigation (<= 15% height, >= 44px touch targets) */}
      <nav
        aria-label="Car owner mobile navigation"
        className="lg:hidden fixed bottom-0 start-0 end-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 h-16 px-1"
      >
        {primaryNav.map((item) => {
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOwnerTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] gap-1 transition-colors cursor-pointer ${
                active ? 'text-[#0F766E]' : 'text-[#64748B]'
              }`}
            >
              {item.icon}
              <span className="text-[11px] font-medium leading-none truncate max-w-full px-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
