import React, { useState } from 'react';
import { MapPin, CheckCircle2, FileCheck, Upload } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { Provider } from '../../types/platform';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export const ProviderProfileManage: React.FC<{ provider: Provider }> = ({ provider }) => {
  const { lang, updateProviderProfile, showToast } = usePlatform();

  const [nameEn, setNameEn] = useState(provider.name.en);
  const [nameAr, setNameAr] = useState(provider.name.ar);
  const [ownerEn, setOwnerEn] = useState(provider.ownerName.en);
  const [descEn, setDescEn] = useState(provider.description.en);
  const [descAr, setDescAr] = useState(provider.description.ar);
  const [phone, setPhone] = useState(provider.phone);
  const [email, setEmail] = useState(provider.email);
  const [addressEn, setAddressEn] = useState(provider.address.en);
  const [hoursEn, setHoursEn] = useState(provider.workingHours.en);
  const [pinCoords, setPinCoords] = useState(provider.mapCoords);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProviderProfile(provider.id, {
      name: { en: nameEn, ar: nameAr },
      ownerName: { en: ownerEn, ar: provider.ownerName.ar },
      description: { en: descEn, ar: descAr },
      phone,
      email,
      address: { en: addressEn, ar: provider.address.ar },
      workingHours: { en: hoursEn, ar: provider.workingHours.ar },
      mapCoords: pinCoords,
    });
    showToast(
      lang === 'ar'
        ? 'تم حفظ بيانات ملف المنشأة بنجاح.'
        : 'Business profile changes saved.'
    );
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPinCoords({ x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) });
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {t(lang, 'providerProfileNav')}
        </h1>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold cursor-pointer"
        >
          {t(lang, 'saveChanges')}
        </button>
      </div>

      {/* Business Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'businessNameLabel')} (EN)
            </label>
            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'businessNameLabel')} (AR)
            </label>
            <input
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              dir="rtl"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'ownerInfoLabel')}
            </label>
            <input
              value={ownerEn}
              onChange={(e) => setOwnerEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'businessHours')}
            </label>
            <input
              value={hoursEn}
              onChange={(e) => setHoursEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'phone')}
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'email')}
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#172B3A] mb-1">
            {t(lang, 'addressLabel')}
          </label>
          <input
            value={addressEn}
            onChange={(e) => setAddressEn(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'businessDescLabel')} (EN)
            </label>
            <textarea
              rows={3}
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'businessDescLabel')} (AR)
            </label>
            <textarea
              rows={3}
              dir="rtl"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>
      </div>

      {/* Simulated Map Location Picker + Images & Verification Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#172B3A]">
              {t(lang, 'mapLocationPicker')}
            </h2>
            <span className="text-xs font-mono text-[#64748B] tabular-nums">
              X:{pinCoords.x}% · Y:{pinCoords.y}%
            </span>
          </div>
          <div
            onClick={handleMapClick}
            className="relative h-48 rounded-xl bg-[#EFF6F6] border border-slate-200 overflow-hidden cursor-crosshair"
          >
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${pinCoords.x}%`, top: `${pinCoords.y}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-md">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>
          <p className="text-xs text-[#64748B]">
            {lang === 'ar'
              ? 'اضغط في أي مكان لتحديث موقع المنشأة التوضيحي.'
              : 'Click anywhere on the simulated grid to reposition your facility pin.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'verificationDocsLabel')}
          </h2>

          <div className="h-24 rounded-xl overflow-hidden border border-slate-200">
            <ImageWithFallback
              src={provider.coverImage}
              alt={bi(provider.name, lang)}
              fallbackLabel={bi(provider.name, lang)}
            />
          </div>

          <div className="divide-y divide-slate-100">
            {provider.verificationDocs.map((doc, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-medium text-[#172B3A] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#0F766E]" />
                  <span>{bi(doc.name, lang)}</span>
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{doc.status === 'verified' ? t(lang, 'verified') : t(lang, 'pending')}</span>
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              showToast(
                lang === 'ar'
                  ? 'تم رفع وثيقة جديدة بنجاح (محاكاة).'
                  : 'Verification document attached (simulated).'
              )
            }
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#172B3A] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{t(lang, 'uploadPhoto')}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
