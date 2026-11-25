import React, { useState } from 'react';
import { Search, X, MessageSquarePlus, Bot } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { BookingRequest, BookingStatus, Provider } from '../../types/platform';
import { BookingStatusBadge } from '../shared/StatusLabel';

export const ProviderRequests: React.FC<{ provider: Provider }> = ({ provider }) => {
  const { lang, bookings, updateBookingStatus, setProviderSection, showToast } = usePlatform();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [selected, setSelected] = useState<BookingRequest | null>(null);

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.vehicleSummary.toLowerCase().includes(q) ||
        b.reportedProblem.en.toLowerCase().includes(q) ||
        b.reportedProblem.ar.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statuses: BookingStatus[] = ['pending', 'accepted', 'in_progress', 'completed', 'rejected'];

  const handleStatusChange = (bookingId: string, nextStatus: BookingStatus) => {
    updateBookingStatus(bookingId, nextStatus);
    if (selected && selected.id === bookingId) {
      setSelected({ ...selected, status: nextStatus });
    }
    showToast(
      lang === 'ar' ? 'تم تحديث حالة الطلب.' : 'Request status updated.'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
            {t(lang, 'providerRequestsNav')}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">{bi(provider.name, lang)}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, 'search')}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-[#172B3A] shadow-sm' : 'text-[#64748B]'
            }`}
          >
            {t(lang, 'all')}
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                statusFilter === st ? 'bg-white text-[#172B3A] shadow-sm' : 'text-[#64748B]'
              }`}
            >
              {st === 'pending'
                ? t(lang, 'pending')
                : st === 'accepted'
                ? t(lang, 'accepted')
                : st === 'in_progress'
                ? t(lang, 'inProgress')
                : st === 'completed'
                ? t(lang, 'completed')
                : t(lang, 'rejected')}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-4 text-start">{t(lang, 'fullName')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'activeVehicleContext')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'reportedSymptoms')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'selectServiceLabel')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'preferredDateLabel')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'appointmentStatus')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'bookingDetails')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748B]">
                    {t(lang, 'noBookings')}
                  </td>
                </tr>
              ) : (
                filtered.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#172B3A] whitespace-nowrap">
                      {bk.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-[#172B3A] whitespace-nowrap">
                      {bk.vehicleSummary}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                      {bi(bk.reportedProblem, lang)}
                    </td>
                    <td className="py-3.5 px-4 text-[#172B3A] whitespace-nowrap">
                      {bi(bk.requestedService, lang)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                      {bk.preferredDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <BookingStatusBadge status={bk.status} />
                    </td>
                    <td className="py-3.5 px-4 text-end whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelected(bk)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0F766E] text-xs font-semibold text-[#172B3A] cursor-pointer"
                      >
                        {t(lang, 'bookingDetails')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#64748B]">{selected.id}</span>
                <h3 className="text-base font-bold text-[#172B3A]">
                  {t(lang, 'requestDetailsTitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#64748B]">{t(lang, 'fullName')}</p>
                  <p className="font-bold text-[#172B3A]">{selected.customerName}</p>
                  <p className="text-xs font-mono text-[#64748B]">{selected.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">{t(lang, 'activeVehicleContext')}</p>
                  <p className="font-bold text-[#172B3A]">{selected.vehicleSummary}</p>
                  <p className="text-xs font-mono text-[#64748B]">
                    {selected.preferredDate} · {selected.preferredTime}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">{t(lang, 'reportedSymptoms')}</p>
                <p className="text-[#172B3A] mt-0.5">{bi(selected.reportedProblem, lang)}</p>
              </div>

              {selected.aiDiagnosticSummary && (
                <div className="p-3.5 rounded-xl bg-[#DCEFEF]/60 border border-[#0F766E]/20 space-y-1">
                  <p className="text-xs font-bold text-[#0F766E] flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    <span>{t(lang, 'aiAssistantTitle')}</span>
                  </p>
                  <p className="text-xs text-[#172B3A] leading-relaxed">
                    {bi(selected.aiDiagnosticSummary, lang)}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-xs font-semibold text-[#172B3A]">
                  {t(lang, 'updateStatusLabel')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selected.id, st)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                        selected.status === st
                          ? 'bg-[#0F766E] border-[#0F766E] text-white'
                          : 'bg-white border-slate-200 text-[#172B3A] hover:border-[#0F766E]'
                      }`}
                    >
                      {st === 'pending'
                        ? t(lang, 'pending')
                        : st === 'accepted'
                        ? t(lang, 'accepted')
                        : st === 'in_progress'
                        ? t(lang, 'inProgress')
                        : st === 'completed'
                        ? t(lang, 'completed')
                        : t(lang, 'rejected')}
                    </button>
                  ))}
                </div>
              </div>

              {(selected.status === 'in_progress' || selected.status === 'completed') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setProviderSection('feedback');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#172B3A] hover:bg-[#1f394d] text-white text-xs font-semibold cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>{t(lang, 'submitFeedbackBtn')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
