import React, { useState } from 'react';
import {
  Bot,
  Wrench,
  Building2,
  Package,
  PhoneCall,
  Star,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Cpu,
  CheckCircle2,
  X,
  Car,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { BookingStatusBadge } from '../shared/StatusLabel';

export const OwnerHome: React.FC = () => {
  const {
    lang,
    ownerName,
    vehicles,
    activeVehicleId,
    setActiveVehicleId,
    providers,
    bookings,
    setOwnerTab,
    openExploreWithFilter,
    openProviderProfile,
    showToast,
  } = usePlatform();

  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const matchedProviders = providers
    .filter((p) => p.verificationStatus !== 'rejected')
    .slice(0, 3);

  const recentBookings = bookings.slice(0, 3);

  const categories = [
    {
      id: 'workshops',
      label: t(lang, 'catWorkshops'),
      icon: <Wrench className="w-5 h-5 text-[#0F766E]" />,
      onClick: () => openExploreWithFilter({ serviceType: 'workshop' }),
    },
    {
      id: 'centers',
      label: t(lang, 'catServiceCenters'),
      icon: <Building2 className="w-5 h-5 text-[#0F766E]" />,
      onClick: () => openExploreWithFilter({ serviceType: 'service_center' }),
    },
    {
      id: 'parts',
      label: t(lang, 'catSpareParts'),
      icon: <Package className="w-5 h-5 text-[#0F766E]" />,
      onClick: () => openExploreWithFilter({ serviceType: 'spare_parts' }),
    },
    {
      id: 'emergency',
      label: t(lang, 'catEmergency'),
      icon: <PhoneCall className="w-5 h-5 text-rose-600" />,
      onClick: () => {
        setDispatched(false);
        setEmergencyOpen(true);
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting & Quick Vehicle Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#64748B]">{t(lang, 'greetingPrefix')}</p>
          <h1 className="text-2xl font-bold text-[#172B3A] tracking-tight">{ownerName}</h1>
        </div>
        {vehicles.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#64748B] whitespace-nowrap">
              {t(lang, 'switchCar')}:
            </label>
            <select
              value={activeVehicleId}
              onChange={(e) => setActiveVehicleId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#172B3A] focus:outline-none focus:border-[#0F766E]"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Hero Row: Dominant AI Diagnosis CTA + My Garage Active Vehicle Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Focal Anchor: Diagnose with AI */}
        <div className="lg:col-span-7 bg-[#0F766E] text-white rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-sm">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#DCEFEF]">
              <Bot className="w-4 h-4" />
              <span>{t(lang, 'aiAssistantTitle')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug text-balance">
              {t(lang, 'diagnoseWithAi')}
            </h2>
            <p className="text-sm text-[#DCEFEF]/90 max-w-xl leading-relaxed">
              {t(lang, 'diagnoseWithAiSub')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setOwnerTab('ai_chat')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#172B3A] hover:bg-[#DCEFEF] text-sm font-bold transition-colors cursor-pointer min-h-[44px]"
            >
              <Bot className="w-4 h-4 text-[#0F766E]" />
              <span>{t(lang, 'startDiagnosisCta')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setOwnerTab('obd')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors cursor-pointer min-h-[44px]"
            >
              <Cpu className="w-4 h-4" />
              <span>{t(lang, 'openObd')}</span>
            </button>
          </div>
        </div>

        {/* My Garage Active Vehicle Summary */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172B3A]">{t(lang, 'myGarageTitle')}</h3>
            <button
              type="button"
              onClick={() => setOwnerTab('garage')}
              className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
            >
              {t(lang, 'manageGarage')}
            </button>
          </div>

          {activeVehicle ? (
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                <ImageWithFallback
                  src={activeVehicle.imageUrl}
                  alt={`${activeVehicle.make} ${activeVehicle.model}`}
                  fallbackLabel={activeVehicle.make}
                />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-base font-bold text-[#172B3A] truncate">
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </p>
                <p className="text-xs text-[#64748B]">
                  {activeVehicle.fuelType} · {activeVehicle.transmission} ·{' '}
                  <span className="font-mono tabular-nums">
                    {activeVehicle.mileageKm.toLocaleString()} km
                  </span>
                </p>
                <p className="text-xs text-[#0F766E] font-medium">
                  {activeVehicle.plateNumber}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <Car className="w-5 h-5" />
              <span>{t(lang, 'noVehiclesTitle')}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#64748B]">{t(lang, 'obdQuickCardTitle')}</span>
            <button
              type="button"
              onClick={() => setOwnerTab('obd')}
              className="font-semibold text-[#0F766E] hover:underline cursor-pointer"
            >
              {t(lang, 'openObd')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Service Categories */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#172B3A]">{t(lang, 'quickCategories')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={cat.onClick}
              className="bg-white border border-slate-200 hover:border-[#0F766E] rounded-2xl p-4 flex flex-col items-start gap-3 transition-colors text-start cursor-pointer min-h-[44px]"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  cat.id === 'emergency' ? 'bg-rose-50' : 'bg-[#DCEFEF]'
                }`}
              >
                {cat.icon}
              </div>
              <span className="text-sm font-semibold text-[#172B3A]">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Nearby Matched Providers & Recent Maintenance Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Nearby Providers */}
        <section className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172B3A]">{t(lang, 'nearbyProviders')}</h2>
            <button
              type="button"
              onClick={() => openExploreWithFilter({ serviceType: 'all' })}
              className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
            >
              {t(lang, 'seeAll')}
            </button>
          </div>

          <div className="space-y-3">
            {matchedProviders.map((prov) => (
              <div
                key={prov.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <ImageWithFallback
                      src={prov.coverImage}
                      alt={bi(prov.name, lang)}
                      fallbackLabel={bi(prov.name, lang)}
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-[#172B3A] truncate">
                        {bi(prov.name, lang)}
                      </h3>
                      {prov.verified && (
                        <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#172B3A] tabular-nums">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {prov.rating}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <MapPin className="w-3.5 h-3.5" />
                        {prov.distanceKm} {t(lang, 'kmAway')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={prov.isOpen ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}>
                        {prov.isOpen ? t(lang, 'openNow') : t(lang, 'closedNow')}
                      </span>
                    </div>
                    {activeVehicle && prov.supportedBrands.includes(activeVehicle.make) && (
                      <p className="text-xs text-[#0F766E] font-medium">
                        {t(lang, 'matchedForVehicle')} {activeVehicle.make} {activeVehicle.model}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openProviderProfile(prov.id)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:border-[#0F766E] hover:text-[#0F766E] text-xs font-semibold text-[#172B3A] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                >
                  {t(lang, 'viewProfile')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Maintenance Activity */}
        <section className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172B3A]">{t(lang, 'recentActivity')}</h2>
            <button
              type="button"
              onClick={() => setOwnerTab('history')}
              className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
            >
              {t(lang, 'seeAll')}
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {recentBookings.map((bk) => (
              <button
                key={bk.id}
                type="button"
                onClick={() => setOwnerTab('history')}
                className="w-full text-start p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-[#172B3A] truncate">
                    {bi(bk.requestedService, lang)}
                  </p>
                  <p className="text-xs text-[#64748B] truncate">
                    {bi(bk.providerName, lang)} · {bk.vehicleSummary}
                  </p>
                  <p className="text-[11px] text-[#64748B] tabular-nums">{bk.preferredDate}</p>
                </div>
                <BookingStatusBadge status={bk.status} />
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Emergency Roadside Assistance Modal */}
      {emergencyOpen && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-600">
                <PhoneCall className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#172B3A]">{t(lang, 'emergencyTitle')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed">{t(lang, 'emergencySub')}</p>
            {activeVehicle && (
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#172B3A]">
                <span className="font-semibold">
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </span>{' '}
                · {activeVehicle.plateNumber}
              </div>
            )}
            {dispatched ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                {t(lang, 'emergencyDispatched')}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDispatched(true);
                  showToast(t(lang, 'emergencyDispatched'));
                }}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {t(lang, 'emergencyDispatchBtn')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
