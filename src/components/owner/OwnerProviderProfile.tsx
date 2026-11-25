import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  CalendarPlus,
  X,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export const OwnerProviderProfile: React.FC = () => {
  const {
    lang,
    providers,
    selectedProviderId,
    setOwnerTab,
    vehicles,
    activeVehicleId,
    reports,
    ownerName,
    ownerPhone,
    createBooking,
    showToast,
  } = usePlatform();

  const provider = providers.find((p) => p.id === selectedProviderId) || providers[0];
  const isRtl = lang === 'ar';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(activeVehicleId || vehicles[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(provider?.services[0]?.id || '');
  const [preferredDate, setPreferredDate] = useState('2026-11-28');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [attachReport, setAttachReport] = useState(true);
  const [notes, setNotes] = useState('');

  if (!provider) return null;

  const visibleReviews = provider.reviews.filter((r) => r.status !== 'hidden');
  const latestReport = reports[0];

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
    const srv =
      provider.services.find((s) => s.id === selectedServiceId) || provider.services[0];

    createBooking({
      customerName: ownerName,
      customerPhone: ownerPhone,
      providerId: provider.id,
      providerName: provider.name,
      vehicleId: veh?.id || 'veh-1',
      vehicleSummary: veh ? `${veh.year} ${veh.make} ${veh.model}` : 'Vehicle',
      reportedProblem: {
        en: notes.trim() || (latestReport && attachReport ? latestReport.summary.en : srv?.name.en || 'Inspection'),
        ar: notes.trim() || (latestReport && attachReport ? latestReport.summary.ar : srv?.name.ar || 'فحص'),
      },
      aiDiagnosticSummary: attachReport && latestReport ? latestReport.summary : undefined,
      diagnosticReportId: attachReport && latestReport ? latestReport.id : undefined,
      requestedService: srv ? srv.name : { en: 'General Diagnostic', ar: 'فحص عام' },
      preferredDate,
      preferredTime,
      estimatedCost: srv?.estimatedPrice,
      notes: notes.trim(),
    });

    setBookModalOpen(false);
    setNotes('');
    showToast(t(lang, 'bookingSuccessMsg'));
    setOwnerTab('history');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => setOwnerTab('explore')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#172B3A] cursor-pointer"
      >
        <BackArrow className="w-4 h-4" />
        <span>{t(lang, 'exploreTitle')}</span>
      </button>

      {/* Cover & Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="h-48 sm:h-60 relative">
          <ImageWithFallback
            src={provider.coverImage}
            alt={bi(provider.name, lang)}
            fallbackLabel={bi(provider.name, lang)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172B3A]/75 via-[#172B3A]/20 to-transparent" />
          <div className="absolute bottom-4 start-5 end-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">{bi(provider.name, lang)}</h1>
                {provider.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0F766E] text-white text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t(lang, 'verified')}</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-white/90 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold tabular-nums">
                  {provider.rating} ({provider.reviewCount} {t(lang, 'reviews')})
                </span>
                <span>·</span>
                <span className="tabular-nums">
                  {provider.distanceKm} {t(lang, 'kmAway')}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  showToast(`${t(lang, 'callProviderBtn')}: ${provider.phone}`)
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/95 hover:bg-white text-[#172B3A] text-xs font-bold cursor-pointer min-h-[42px]"
              >
                <Phone className="w-4 h-4 text-[#0F766E]" />
                <span>{t(lang, 'callProviderBtn')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedServiceId(provider.services[0]?.id || '');
                  setBookModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-xs font-bold cursor-pointer min-h-[42px]"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>{t(lang, 'bookAppointmentBtn')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <p className="text-sm text-[#172B3A] leading-relaxed">
              {bi(provider.description, lang)}
            </p>
            <div>
              <h2 className="text-xs font-bold text-[#64748B] mb-1.5">
                {t(lang, 'supportedBrandsLabel')}
              </h2>
              <p className="text-sm font-medium text-[#172B3A]">
                {provider.supportedBrands.join(' · ')} ({provider.supportedYears})
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs border-t md:border-t-0 md:border-s border-slate-100 pt-4 md:pt-0 md:ps-6">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#172B3A]">{t(lang, 'addressLabel')}</p>
                <p className="text-[#64748B]">{bi(provider.address, lang)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#172B3A]">{t(lang, 'businessHours')}</p>
                <p className="text-[#64748B]">{bi(provider.workingHours, lang)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#172B3A]">{t(lang, 'contactLabel')}</p>
                <p className="text-[#64748B] font-mono">{provider.phone}</p>
                <p className="text-[#64748B]">{provider.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-[#172B3A]">
            {t(lang, 'servicesAvailableLabel')}
          </h2>
          <div className="divide-y divide-slate-100">
            {provider.services.map((srv) => (
              <div
                key={srv.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#172B3A]">{bi(srv.name, lang)}</h3>
                  <p className="text-xs text-[#64748B]">{bi(srv.description, lang)}</p>
                  <p className="text-xs font-mono text-[#0F766E] tabular-nums">
                    {srv.estimatedPrice} · {bi(srv.duration, lang)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedServiceId(srv.id);
                    setBookModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[#0F766E] text-[#0F766E] hover:bg-[#DCEFEF] text-xs font-semibold shrink-0 cursor-pointer"
                >
                  {t(lang, 'bookAppointmentBtn')}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5 space-y-6">
          {/* Photos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h2 className="text-base font-bold text-[#172B3A]">{t(lang, 'galleryLabel')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {provider.galleryImages.map((img, idx) => (
                <div key={idx} className="h-28 rounded-xl overflow-hidden border border-slate-200">
                  <ImageWithFallback
                    src={img}
                    alt={`${bi(provider.name, lang)} ${idx + 1}`}
                    fallbackLabel={bi(provider.name, lang)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h2 className="text-base font-bold text-[#172B3A]">
              {t(lang, 'customerReviewsLabel')}
            </h2>
            {visibleReviews.length === 0 ? (
              <p className="text-xs text-[#64748B]">
                {lang === 'ar' ? 'لا توجد تقييمات بعد.' : 'No reviews yet.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {visibleReviews.map((rev) => (
                  <div key={rev.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#172B3A]">{rev.author}</span>
                      <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {rev.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      {rev.vehicle} · {rev.date}
                    </p>
                    <p className="text-xs text-[#172B3A] leading-relaxed">
                      {bi(rev.comment, lang)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Book Appointment Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172B3A]">{t(lang, 'bookModalTitle')}</h3>
              <button
                type="button"
                onClick={() => setBookModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  {t(lang, 'selectVehicleLabel')}
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.plateNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  {t(lang, 'selectServiceLabel')}
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {provider.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {bi(s.name, lang)} ({s.estimatedPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'preferredDateLabel')}
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'preferredTimeLabel')}
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              {latestReport && (
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#DCEFEF]/50 border border-[#0F766E]/20 cursor-pointer text-xs text-[#172B3A]">
                  <input
                    type="checkbox"
                    checked={attachReport}
                    onChange={(e) => setAttachReport(e.target.checked)}
                    className="accent-[#0F766E]"
                  />
                  <span className="font-medium">
                    {t(lang, 'attachDiagnosticLabel')} ({latestReport.vehicleLabel})
                  </span>
                </label>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  {t(lang, 'problemNotesLabel')}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'اذكر أي تفاصيل إضافية للورشة...'
                      : 'Add any extra details for the mechanic...'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-[#64748B] cursor-pointer"
                >
                  {t(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold cursor-pointer"
                >
                  {t(lang, 'confirmBookingBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
