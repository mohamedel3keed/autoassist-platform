import React, { useState } from 'react';
import {
  Car,
  Wrench,
  Building2,
  Package,
  X,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { t } from '../../i18n/translations';
import { ASSET_IMAGES } from '../../data/mockData';
import { ProviderType, Vehicle } from '../../types/platform';

type AccountChoice = 'car_owner' | ProviderType;

export const OnboardingModal: React.FC = () => {
  const {
    lang,
    onboardingOpen,
    setOnboardingOpen,
    setRole,
    setOwnerTab,
    setOwnerName,
    setOwnerEmail,
    setOwnerPhone,
    setOwnerAvatar,
    addVehicle,
    setProviderDemoType,
    setProviderSection,
    showToast,
  } = usePlatform();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accountType, setAccountType] = useState<AccountChoice>('car_owner');

  // Step 2 Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 3 Vehicle Form State
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Corolla');
  const [year, setYear] = useState('2023');
  const [engineType, setEngineType] = useState('1.8L Hybrid');
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('Hybrid');
  const [transmission, setTransmission] = useState<Vehicle['transmission']>('CVT');
  const [plateNumber, setPlateNumber] = useState('KSA 7742');
  const [mileageKm, setMileageKm] = useState('24500');
  const [vehiclePreview, setVehiclePreview] = useState<string>(ASSET_IMAGES.sedan);

  if (!onboardingOpen) return null;

  const isRtl = lang === 'ar';
  const NextArrow = isRtl ? ArrowLeft : ArrowRight;
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const accountOptions: {
    id: AccountChoice;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'car_owner',
      title: t(lang, 'accountCarOwner'),
      desc: t(lang, 'accountCarOwnerDesc'),
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: 'workshop',
      title: t(lang, 'accountWorkshop'),
      desc: t(lang, 'accountWorkshopDesc'),
      icon: <Wrench className="w-5 h-5" />,
    },
    {
      id: 'service_center',
      title: t(lang, 'accountServiceCenter'),
      desc: t(lang, 'accountServiceCenterDesc'),
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'spare_parts',
      title: t(lang, 'accountSpareParts'),
      desc: t(lang, 'accountSparePartsDesc'),
      icon: <Package className="w-5 h-5" />,
    },
  ];

  const handleFilePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setter(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateStep2 = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = t(lang, 'requiredField');
    if (!email.trim() || !email.includes('@')) nextErrors.email = t(lang, 'requiredField');
    if (!phone.trim()) nextErrors.phone = t(lang, 'requiredField');
    if (password.trim().length < 4) nextErrors.password = t(lang, 'requiredField');
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    if (accountType === 'car_owner') {
      setOwnerName(fullName.trim());
      setOwnerEmail(email.trim());
      setOwnerPhone(phone.trim());
      if (avatarPreview) setOwnerAvatar(avatarPreview);
      setStep(3);
    } else {
      setProviderDemoType(accountType);
      setProviderSection('profile');
      setRole('provider');
      setOnboardingOpen(false);
      setStep(1);
      showToast(
        lang === 'ar'
          ? 'تم إنشاء حساب مزود الخدمة بنجاح (وضع العرض).'
          : 'Provider account registered! Complete your business profile below.'
      );
    }
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) return;
    addVehicle({
      make: make.trim(),
      model: model.trim(),
      year: Number(year) || 2023,
      engineType: engineType.trim() || '2.0L',
      fuelType,
      transmission,
      plateNumber: plateNumber.trim() || 'KSA 1000',
      mileageKm: Number(mileageKm) || 15000,
      imageUrl: vehiclePreview,
      color: { en: 'Silver', ar: 'فضي' },
      lastServiceDate: new Date().toISOString().slice(0, 10),
    });
    setRole('car_owner');
    setOwnerTab('home');
    setOnboardingOpen(false);
    setStep(1);
    showToast(
      lang === 'ar'
        ? 'تم تسجيل الحساب وإضافة السيارة بنجاح!'
        : 'Account registered and primary vehicle added to My Garage!'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#0F766E]">
              {t(lang, 'step')} {step} {t(lang, 'of')} {accountType === 'car_owner' ? 3 : 2}
            </p>
            <h2 className="text-lg font-bold text-[#172B3A]">
              {step === 1
                ? t(lang, 'onboardingTitle')
                : step === 2
                ? t(lang, 'regFormTitle')
                : t(lang, 'addFirstVehicle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOnboardingOpen(false)}
            aria-label={t(lang, 'close')}
            className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[78vh] overflow-y-auto">
          {/* Step 1: Account Type Selection */}
          {step === 1 && (
            <div className="space-y-5">
              <p className="text-sm text-[#64748B]">{t(lang, 'onboardingSubtitle')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {accountOptions.map((opt) => {
                  const selected = accountType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAccountType(opt.id)}
                      className={`text-start p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                        selected
                          ? 'border-[#0F766E] bg-[#DCEFEF]/40 ring-2 ring-[#0F766E]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selected
                              ? 'bg-[#0F766E] text-white'
                              : 'bg-slate-100 text-[#172B3A]'
                          }`}
                        >
                          {opt.icon}
                        </div>
                        {selected && <CheckCircle2 className="w-5 h-5 text-[#0F766E]" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#172B3A]">{opt.title}</h3>
                        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-[#64748B]">{t(lang, 'simulatedNotice')}</span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <span>{t(lang, 'next')}</span>
                  <NextArrow className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'fullName')} *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'ar' ? 'عبدالله السالم' : 'Abdullah Al-Salem'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'email')} *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'phone')} *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 55 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                  {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'password')} *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                  {errors.password && (
                    <p className="text-xs text-rose-600 mt-1">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Optional Profile Picture */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                  {t(lang, 'profilePicOptional')}
                </label>
                <div className="flex items-center gap-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#DCEFEF] text-[#0F766E] flex items-center justify-center font-bold text-sm">
                      {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-[#172B3A] cursor-pointer">
                    <Upload className="w-4 h-4 text-[#0F766E]" />
                    <span>{t(lang, 'uploadPhoto')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFilePreview(e, setAvatarPreview)}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-[#64748B] hover:text-[#172B3A] cursor-pointer"
                >
                  <BackArrow className="w-4 h-4" />
                  <span>{t(lang, 'back')}</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>
                    {accountType === 'car_owner'
                      ? t(lang, 'continueToVehicle')
                      : t(lang, 'completeRegistration')}
                  </span>
                  <NextArrow className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Add First Vehicle */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'vehicleMake')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'vehicleModel')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'vehicleYear')} *
                  </label>
                  <input
                    type="number"
                    min="1995"
                    max="2027"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm tabular-nums focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'fuelType')} *
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as Vehicle['fuelType'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#0F766E]"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'engineTypeOptional')}
                  </label>
                  <input
                    type="text"
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'transmissionOptional')}
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as Vehicle['transmission'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#0F766E]"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'plateNumber')}
                  </label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    {t(lang, 'mileageKm')}
                  </label>
                  <input
                    type="number"
                    value={mileageKm}
                    onChange={(e) => setMileageKm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm tabular-nums focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                  {t(lang, 'vehicleImageOptional')}
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={vehiclePreview}
                    alt="Vehicle preview"
                    className="w-20 h-14 rounded-lg object-cover border border-slate-200"
                  />
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-[#172B3A] cursor-pointer">
                    <Upload className="w-4 h-4 text-[#0F766E]" />
                    <span>{t(lang, 'uploadPhoto')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFilePreview(e, setVehiclePreview)}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setOnboardingOpen(false);
                    setStep(1);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#172B3A] cursor-pointer"
                >
                  {t(lang, 'skipForNow')}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t(lang, 'finishSetup')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
