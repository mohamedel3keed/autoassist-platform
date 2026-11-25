import React, { useState } from 'react';
import { FileText, Calendar, Wrench, X } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { BookingStatusBadge } from '../shared/StatusLabel';
import { BookingRequest } from '../../types/platform';

export const OwnerHistory: React.FC = () => {
  const {
    lang,
    bookings,
    reports,
    feedbackRecords,
    setActiveReportId,
    setOwnerTab,
  } = usePlatform();

  const [tab, setTab] = useState<'bookings' | 'completed' | 'reports' | 'records'>('bookings');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const tabs = [
    { id: 'bookings' as const, label: t(lang, 'tabBookings') },
    { id: 'completed' as const, label: t(lang, 'tabCompleted') },
    { id: 'reports' as const, label: t(lang, 'tabReports') },
    { id: 'records' as const, label: t(lang, 'tabRecords') },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#172B3A]">{t(lang, 'historyTitle')}</h1>

      {/* Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              tab === item.id
                ? 'bg-white text-[#172B3A] shadow-sm'
                : 'text-[#64748B] hover:text-[#172B3A]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Bookings & Completed Lists */}
      {(tab === 'bookings' || tab === 'completed') && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {(tab === 'bookings' ? bookings : completedBookings).length === 0 ? (
            <p className="p-8 text-sm text-[#64748B] text-center">{t(lang, 'noBookings')}</p>
          ) : (
            (tab === 'bookings' ? bookings : completedBookings).map((bk) => (
              <div
                key={bk.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#64748B]">{bk.id}</span>
                    <span className="text-sm font-bold text-[#172B3A] truncate">
                      {bi(bk.requestedService, lang)}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B]">
                    {bi(bk.providerName, lang)} · {bk.vehicleSummary}
                  </p>
                  <p className="text-xs text-[#64748B] flex items-center gap-1.5 tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {bk.preferredDate} · {bk.preferredTime}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <BookingStatusBadge status={bk.status} />
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(bk)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#172B3A] hover:border-[#0F766E] cursor-pointer"
                  >
                    {t(lang, 'bookingDetails')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Saved Diagnostic Reports */}
      {tab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span className="font-semibold text-[#0F766E]">{rep.vehicleLabel}</span>
                  <span className="font-mono tabular-nums">{rep.createdAt}</span>
                </div>
                <p className="text-sm font-medium text-[#172B3A] leading-relaxed">
                  {bi(rep.summary, lang)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveReportId(rep.id);
                  setOwnerTab('diagnostic_report');
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#DCEFEF] hover:bg-[#cbe6e6] text-[#0F766E] text-xs font-semibold cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{t(lang, 'openReport')}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Repair Records */}
      {tab === 'records' && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {feedbackRecords.map((rec) => (
            <div key={rec.id} className="p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#0F766E]" />
                  <h3 className="text-sm font-bold text-[#172B3A]">
                    {rec.vehicleSummary} — {bi(rec.actualDiagnosedFault, lang)}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#64748B] tabular-nums">
                  {rec.submittedAt}
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                {bi(rec.providerName, lang)} · {bi(rec.repairPerformed, lang)}
              </p>
              <p className="text-xs text-[#172B3A]">
                <span className="font-semibold">{t(lang, 'partsUsedLabel')}: </span>
                {bi(rec.sparePartsUsed, lang)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172B3A]">{t(lang, 'bookingDetails')}</h3>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">{t(lang, 'appointmentStatus')}</span>
                <BookingStatusBadge status={selectedBooking.status} />
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{t(lang, 'selectServiceLabel')}</p>
                <p className="font-semibold text-[#172B3A]">
                  {bi(selectedBooking.requestedService, lang)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{t(lang, 'activeVehicleContext')}</p>
                <p className="font-semibold text-[#172B3A]">{selectedBooking.vehicleSummary}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{t(lang, 'reportedSymptoms')}</p>
                <p className="text-[#172B3A]">{bi(selectedBooking.reportedProblem, lang)}</p>
              </div>
              {selectedBooking.aiDiagnosticSummary && (
                <div className="p-3 rounded-xl bg-[#DCEFEF]/50 text-xs text-[#172B3A]">
                  <p className="font-semibold text-[#0F766E] mb-1">
                    {t(lang, 'aiAssistantTitle')}
                  </p>
                  <p>{bi(selectedBooking.aiDiagnosticSummary, lang)}</p>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-slate-100">
                <span>
                  {selectedBooking.preferredDate} · {selectedBooking.preferredTime}
                </span>
                {selectedBooking.estimatedCost && (
                  <span className="font-mono font-semibold text-[#172B3A]">
                    {selectedBooking.estimatedCost}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
