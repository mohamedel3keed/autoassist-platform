import React, { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  Car,
  Info,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { ProviderType } from '../../types/platform';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export const OwnerExplore: React.FC = () => {
  const {
    lang,
    providers,
    vehicles,
    activeVehicleId,
    explorePreset,
    openProviderProfile,
  } = usePlatform();

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  const [query, setQuery] = useState(explorePreset.query || '');
  const [serviceType, setServiceType] = useState<ProviderType | 'all'>(
    explorePreset.serviceType || 'all'
  );
  const [brandFilter, setBrandFilter] = useState<string>(explorePreset.brand || 'all');
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [minRating, setMinRating] = useState<number>(0);
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [selectedPinId, setSelectedPinId] = useState<string>(providers[0]?.id || '');

  useEffect(() => {
    if (explorePreset.serviceType) setServiceType(explorePreset.serviceType);
    if (explorePreset.brand) setBrandFilter(explorePreset.brand);
  }, [explorePreset]);

  const allBrands = Array.from(new Set(providers.flatMap((p) => p.supportedBrands)));

  const filteredProviders = providers.filter((p) => {
    if (p.verificationStatus === 'rejected') return false;
    if (serviceType !== 'all' && p.type !== serviceType) return false;
    if (brandFilter !== 'all' && !p.supportedBrands.includes(brandFilter)) return false;
    if (p.distanceKm > maxDistance) return false;
    if (p.rating < minRating) return false;
    if (openOnly && !p.isOpen) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchName =
        p.name.en.toLowerCase().includes(q) || p.name.ar.toLowerCase().includes(q);
      const matchBrand = p.supportedBrands.some((b) => b.toLowerCase().includes(q));
      const matchService = p.services.some(
        (s) => s.name.en.toLowerCase().includes(q) || s.name.ar.toLowerCase().includes(q)
      );
      if (!matchName && !matchBrand && !matchService) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setQuery('');
    setServiceType('all');
    setBrandFilter('all');
    setMaxDistance(20);
    setMinRating(0);
    setOpenOnly(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#172B3A]">{t(lang, 'exploreTitle')}</h1>
          {activeVehicle && (
            <p className="text-xs sm:text-sm text-[#0F766E] font-medium flex items-center gap-1.5 mt-1">
              <Car className="w-4 h-4" />
              <span>
                {t(lang, 'matchedForVehicle')} {activeVehicle.year} {activeVehicle.make}{' '}
                {activeVehicle.model}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, 'searchProvidersPlaceholder')}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t(lang, 'filter')}:</span>
          </div>

          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ProviderType | 'all')}
            aria-label={t(lang, 'filterServiceType')}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#172B3A]"
          >
            <option value="all">{t(lang, 'filterServiceType')}: {t(lang, 'all')}</option>
            <option value="workshop">{t(lang, 'catWorkshops')}</option>
            <option value="service_center">{t(lang, 'catServiceCenters')}</option>
            <option value="spare_parts">{t(lang, 'catSpareParts')}</option>
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            aria-label={t(lang, 'filterBrand')}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#172B3A]"
          >
            <option value="all">{t(lang, 'filterBrand')}: {t(lang, 'all')}</option>
            {allBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            aria-label={t(lang, 'filterDistance')}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#172B3A]"
          >
            <option value={20}>{t(lang, 'filterDistance')}: {t(lang, 'all')}</option>
            <option value={3}>≤ 3 km</option>
            <option value={5}>≤ 5 km</option>
            <option value={10}>≤ 10 km</option>
          </select>

          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            aria-label={t(lang, 'filterRating')}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#172B3A]"
          >
            <option value={0}>{t(lang, 'filterRating')}: {t(lang, 'all')}</option>
            <option value={4.5}>4.5+</option>
            <option value={4.8}>4.8+</option>
          </select>

          <button
            type="button"
            onClick={() => setOpenOnly(!openOnly)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              openOnly
                ? 'bg-[#0F766E] border-[#0F766E] text-white'
                : 'bg-white border-slate-200 text-[#172B3A]'
            }`}
          >
            {t(lang, 'filterOpenOnly')}
          </button>
        </div>
      </div>

      {/* Simulated Map Area + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Simulated Interactive Map */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-[#DCEFEF]/60 border-b border-slate-200 flex items-center gap-2 text-xs font-medium text-[#0F766E]">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{t(lang, 'simulatedMapLabel')}</span>
          </div>

          <div className="relative h-72 sm:h-80 bg-[#EFF6F6] overflow-hidden select-none">
            {/* Subtle Architectural Grid Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 0 110 Q 180 90 450 150" stroke="#94A3B8" strokeWidth="4" fill="none" opacity="0.4" />
              <path d="M 140 0 Q 170 160 150 320" stroke="#94A3B8" strokeWidth="4" fill="none" opacity="0.4" />
            </svg>

            {/* User Location Marker */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="w-4 h-4 rounded-full bg-[#172B3A] border-2 border-white shadow-md" />
              <span className="mt-1 px-2 py-0.5 rounded bg-[#172B3A] text-white text-[10px] font-semibold whitespace-nowrap">
                {lang === 'ar' ? 'موقعك' : 'You'}
              </span>
            </div>

            {/* Provider Map Pins */}
            {filteredProviders.map((prov) => {
              const selected = selectedPinId === prov.id;
              return (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setSelectedPinId(prov.id)}
                  style={{ left: `${prov.mapCoords.x}%`, top: `${prov.mapCoords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform ${
                    selected ? 'scale-110 z-20' : 'z-10 hover:scale-105'
                  }`}
                >
                  <div
                    className={`px-2.5 py-1 rounded-lg shadow-sm border text-[11px] font-bold whitespace-nowrap flex items-center gap-1 ${
                      selected
                        ? 'bg-[#0F766E] text-white border-[#0F766E]'
                        : 'bg-white text-[#172B3A] border-slate-300'
                    }`}
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="tabular-nums">{prov.distanceKm} km</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Highlighted Pin Preview */}
          {(() => {
            const highlighted =
              filteredProviders.find((p) => p.id === selectedPinId) || filteredProviders[0];
            if (!highlighted) return null;
            return (
              <div className="p-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#172B3A] truncate">
                    {bi(highlighted.name, lang)}
                  </p>
                  <p className="text-xs text-[#64748B] truncate">{bi(highlighted.address, lang)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openProviderProfile(highlighted.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold shrink-0 cursor-pointer"
                >
                  {t(lang, 'viewProfile')}
                </button>
              </div>
            );
          })()}
        </div>

        {/* Provider Cards List */}
        <div className="lg:col-span-7 space-y-4">
          {filteredProviders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <p className="text-sm text-[#64748B]">{t(lang, 'noProvidersFound')}</p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
              >
                {t(lang, 'resetFilters')}
              </button>
            </div>
          ) : (
            filteredProviders.map((prov) => {
              const matchesCar =
                activeVehicle && prov.supportedBrands.includes(activeVehicle.make);
              return (
                <div
                  key={prov.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <ImageWithFallback
                      src={prov.coverImage}
                      alt={bi(prov.name, lang)}
                      fallbackLabel={bi(prov.name, lang)}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h2 className="text-base font-bold text-[#172B3A] truncate">
                            {bi(prov.name, lang)}
                          </h2>
                          {prov.verified && (
                            <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            prov.isOpen ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {prov.isOpen ? t(lang, 'openNow') : t(lang, 'closedNow')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#172B3A] tabular-nums">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {prov.rating} ({prov.reviewCount})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          {prov.distanceKm} {t(lang, 'kmAway')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {prov.type === 'workshop'
                            ? t(lang, 'catWorkshops')
                            : prov.type === 'service_center'
                            ? t(lang, 'catServiceCenters')
                            : t(lang, 'catSpareParts')}
                        </span>
                      </div>

                      <p className="text-xs text-[#64748B] line-clamp-2">
                        {bi(prov.description, lang)}
                      </p>

                      <div className="text-xs text-[#172B3A] pt-1">
                        <span className="text-[#64748B]">{t(lang, 'supportedBrandsLabel')}: </span>
                        <span className="font-medium">{prov.supportedBrands.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      {matchesCar ? (
                        <span className="text-xs font-semibold text-[#0F766E]">
                          {t(lang, 'matchedForVehicle')} {activeVehicle.make} {activeVehicle.model}
                        </span>
                      ) : (
                        <span className="text-xs text-[#64748B]">{bi(prov.address, lang)}</span>
                      )}

                      <button
                        type="button"
                        onClick={() => openProviderProfile(prov.id)}
                        className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {t(lang, 'viewProfile')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
