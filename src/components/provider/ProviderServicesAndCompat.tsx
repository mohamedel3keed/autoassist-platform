import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Check } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { Provider, ProviderService } from '../../types/platform';

export const ProviderServicesManage: React.FC<{ provider: Provider }> = ({ provider }) => {
  const {
    lang,
    addProviderService,
    updateProviderService,
    deleteProviderService,
    showToast,
  } = usePlatform();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProviderService | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState('');
  const [brands, setBrands] = useState('Toyota, Hyundai');

  const openAdd = () => {
    setEditing(null);
    setNameEn('');
    setNameAr('');
    setDescEn('');
    setDescAr('');
    setPrice('200 – 350 SAR');
    setBrands(provider.supportedBrands.join(', '));
    setModalOpen(true);
  };

  const openEdit = (srv: ProviderService) => {
    setEditing(srv);
    setNameEn(srv.name.en);
    setNameAr(srv.name.ar);
    setDescEn(srv.description.en);
    setDescAr(srv.description.ar);
    setPrice(srv.estimatedPrice);
    setBrands(srv.supportedBrands.join(', '));
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;
    const brandArr = brands
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editing) {
      updateProviderService(provider.id, {
        ...editing,
        name: { en: nameEn.trim(), ar: nameAr.trim() || nameEn.trim() },
        description: { en: descEn.trim(), ar: descAr.trim() || descEn.trim() },
        estimatedPrice: price.trim() || '150 SAR',
        supportedBrands: brandArr,
      });
      showToast(lang === 'ar' ? 'تم تحديث الخدمة.' : 'Service updated.');
    } else {
      addProviderService(provider.id, {
        name: { en: nameEn.trim(), ar: nameAr.trim() || nameEn.trim() },
        description: { en: descEn.trim(), ar: descAr.trim() || descEn.trim() },
        estimatedPrice: price.trim() || '150 SAR',
        duration: { en: '60 mins', ar: '60 دقيقة' },
        category: 'General Service',
        supportedBrands: brandArr,
      });
      showToast(lang === 'ar' ? 'تمت إضافة الخدمة الجديدة.' : 'New service added.');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {t(lang, 'providerServicesNav')}
        </h1>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t(lang, 'addServiceBtn')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {provider.services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-bold text-[#172B3A]">{bi(srv.name, lang)}</h2>
                <span className="font-mono text-xs font-bold text-[#0F766E] whitespace-nowrap">
                  {srv.estimatedPrice}
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {bi(srv.description, lang)}
              </p>
              <p className="text-xs text-[#172B3A]">
                <span className="text-[#64748B]">{t(lang, 'supportedBrandsLabel')}: </span>
                {srv.supportedBrands.join(', ')}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => openEdit(srv)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#172B3A] hover:bg-slate-50 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t(lang, 'edit')}</span>
              </button>
              <button
                type="button"
                onClick={() => deleteProviderService(provider.id, srv.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t(lang, 'delete')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172B3A]">
                {editing ? t(lang, 'edit') : t(lang, 'addServiceBtn')}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'serviceNameLabel')} (EN) *
                  </label>
                  <input
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'serviceNameLabel')} (AR)
                  </label>
                  <input
                    dir="rtl"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  {t(lang, 'serviceDescLabel')}
                </label>
                <textarea
                  rows={2}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'estimatedPriceLabel')}
                  </label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'supportedBrandsLabel')}
                  </label>
                  <input
                    value={brands}
                    onChange={(e) => setBrands(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-[#64748B] cursor-pointer"
                >
                  {t(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-semibold cursor-pointer"
                >
                  {t(lang, 'save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProviderCompatibility: React.FC<{ provider: Provider }> = ({ provider }) => {
  const { lang, updateProviderProfile, showToast } = usePlatform();
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [yearsRange, setYearsRange] = useState(provider.supportedYears);

  const allCategories = ['Sedan', 'SUV', 'Hybrid', 'Electric', 'Light Truck'];

  const toggleCategory = (cat: string) => {
    const exists = provider.vehicleCategories.includes(cat);
    const next = exists
      ? provider.vehicleCategories.filter((c) => c !== cat)
      : [...provider.vehicleCategories, cat];
    updateProviderProfile(provider.id, { vehicleCategories: next });
  };

  const handleAddMake = () => {
    if (!newMake.trim()) return;
    if (!provider.supportedBrands.includes(newMake.trim())) {
      updateProviderProfile(provider.id, {
        supportedBrands: [...provider.supportedBrands, newMake.trim()],
      });
    }
    setNewMake('');
  };

  const handleAddModel = () => {
    if (!newModel.trim()) return;
    if (!provider.supportedModels.includes(newModel.trim())) {
      updateProviderProfile(provider.id, {
        supportedModels: [...provider.supportedModels, newModel.trim()],
      });
    }
    setNewModel('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {t(lang, 'providerCompatibilityNav')}
        </h1>
        <button
          type="button"
          onClick={() => {
            updateProviderProfile(provider.id, { supportedYears: yearsRange });
            showToast(
              lang === 'ar'
                ? 'تم حفظ إعدادات توافق المركبات.'
                : 'Vehicle compatibility saved.'
            );
          }}
          className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold cursor-pointer"
        >
          {t(lang, 'saveChanges')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supported Makes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">{t(lang, 'supportedMakesLabel')}</h2>
          <div className="flex gap-2">
            <input
              value={newMake}
              onChange={(e) => setNewMake(e.target.value)}
              placeholder={t(lang, 'addBrandPlaceholder')}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <button
              type="button"
              onClick={handleAddMake}
              className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
            >
              {t(lang, 'add')}
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {provider.supportedBrands.map((b) => (
              <div key={b} className="py-2.5 flex items-center justify-between text-sm">
                <span className="font-medium text-[#172B3A]">{b}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateProviderProfile(provider.id, {
                      supportedBrands: provider.supportedBrands.filter((x) => x !== b),
                    })
                  }
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  {t(lang, 'delete')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Models */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'supportedModelsLabel')}
          </h2>
          <div className="flex gap-2">
            <input
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              placeholder="Altima, Accord..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <button
              type="button"
              onClick={handleAddModel}
              className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
            >
              {t(lang, 'add')}
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {provider.supportedModels.map((m) => (
              <div key={m} className="py-2.5 flex items-center justify-between text-sm">
                <span className="font-medium text-[#172B3A]">{m}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateProviderProfile(provider.id, {
                      supportedModels: provider.supportedModels.filter((x) => x !== m),
                    })
                  }
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  {t(lang, 'delete')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Years & Vehicle Categories */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#172B3A] mb-2">
            {t(lang, 'supportedYearsLabel')}
          </label>
          <input
            value={yearsRange}
            onChange={(e) => setYearsRange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-[#172B3A] mb-2">
            {t(lang, 'vehicleCategoriesLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const active = provider.vehicleCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    active
                      ? 'bg-[#DCEFEF] border-[#0F766E] text-[#0F766E]'
                      : 'bg-white border-slate-200 text-[#64748B]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
