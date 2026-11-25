import React from 'react';
import { Globe, Cpu, UserPlus, Car, ShieldCheck } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { t } from '../../i18n/translations';

export const OwnerProfile: React.FC = () => {
  const {
    lang,
    toggleLang,
    ownerName,
    ownerEmail,
    ownerPhone,
    ownerAvatar,
    vehicles,
    bookings,
    setOwnerTab,
    setOnboardingOpen,
    setRole,
  } = usePlatform();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#172B3A]">{t(lang, 'navProfile')}</h1>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {ownerAvatar ? (
            <img
              src={ownerAvatar}
              alt={ownerName}
              className="w-16 h-16 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#DCEFEF] text-[#0F766E] flex items-center justify-center text-xl font-bold">
              {ownerName.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-[#172B3A]">{ownerName}</h2>
            <p className="text-xs text-[#64748B]">{ownerEmail}</p>
            <p className="text-xs font-mono text-[#64748B] mt-0.5">{ownerPhone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <div className="px-4">
            <p className="text-xl font-bold text-[#172B3A] tabular-nums">{vehicles.length}</p>
            <p className="text-xs text-[#64748B]">{t(lang, 'navGarage')}</p>
          </div>
          <div className="px-4 border-s border-slate-200">
            <p className="text-xl font-bold text-[#172B3A] tabular-nums">{bookings.length}</p>
            <p className="text-xs text-[#64748B]">{t(lang, 'tabBookings')}</p>
          </div>
        </div>
      </div>

      {/* Quick Settings & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        <button
          type="button"
          onClick={toggleLang}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#0F766E]" />
            <span className="text-sm font-semibold text-[#172B3A]">
              {lang === 'ar' ? 'تغيير اللغة (العربية / English)' : 'Switch Language (English / العربية)'}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#0F766E] bg-[#DCEFEF] px-3 py-1 rounded-lg">
            {t(lang, 'languageLabel')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOwnerTab('obd')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#0F766E]" />
            <span className="text-sm font-semibold text-[#172B3A]">{t(lang, 'obdTitle')}</span>
          </div>
          <span className="text-xs text-[#64748B]">{t(lang, 'openObd')}</span>
        </button>

        <button
          type="button"
          onClick={() => setOwnerTab('garage')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-[#0F766E]" />
            <span className="text-sm font-semibold text-[#172B3A]">{t(lang, 'myGarageTitle')}</span>
          </div>
          <span className="text-xs text-[#64748B]">{t(lang, 'manageGarage')}</span>
        </button>

        <button
          type="button"
          onClick={() => setOnboardingOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-[#0F766E]" />
            <span className="text-sm font-semibold text-[#172B3A]">{t(lang, 'onboardingBtn')}</span>
          </div>
          <span className="text-xs text-[#64748B]">A1</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('provider')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
            <span className="text-sm font-semibold text-[#172B3A]">{t(lang, 'roleProvider')}</span>
          </div>
          <span className="text-xs text-[#0F766E] font-medium">
            {lang === 'ar' ? 'معاينة' : 'Preview'}
          </span>
        </button>
      </div>
    </div>
  );
};
