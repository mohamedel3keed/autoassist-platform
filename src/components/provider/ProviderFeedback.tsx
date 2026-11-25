import React, { useState } from 'react';
import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { Provider } from '../../types/platform';

export const ProviderFeedback: React.FC<{ provider: Provider }> = ({ provider }) => {
  const { lang, bookings, feedbackRecords, addFeedbackRecord, showToast } = usePlatform();

  const eligibleBookings = bookings.filter(
    (b) => b.status === 'in_progress' || b.status === 'completed' || b.status === 'accepted'
  );

  const [bookingId, setBookingId] = useState(eligibleBookings[0]?.id || bookings[0]?.id || '');
  const [actualFault, setActualFault] = useState('');
  const [failedComponent, setFailedComponent] = useState('');
  const [repairPerformed, setRepairPerformed] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [finalStatus, setFinalStatus] = useState<'resolved' | 'follow_up_required'>('resolved');
  const [matchedAi, setMatchedAi] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualFault.trim() || !failedComponent.trim() || !repairPerformed.trim()) return;

    const bk = bookings.find((b) => b.id === bookingId) || bookings[0];

    addFeedbackRecord({
      bookingId: bk?.id || 'bk-manual',
      vehicleSummary: bk?.vehicleSummary || '2022 Toyota Camry Hybrid',
      reportedSymptom: bk?.reportedProblem || {
        en: 'Reported vehicle fault',
        ar: 'عطل مركبة مبلّغ عنه',
      },
      aiPredictedFault: bk?.aiDiagnosticSummary || {
        en: 'Charging circuit voltage drop',
        ar: 'هبوط جهد دائرة الشحن',
      },
      actualDiagnosedFault: { en: actualFault.trim(), ar: actualFault.trim() },
      confirmedFailedComponent: { en: failedComponent.trim(), ar: failedComponent.trim() },
      repairPerformed: { en: repairPerformed.trim(), ar: repairPerformed.trim() },
      sparePartsUsed: {
        en: partsUsed.trim() || 'None required',
        ar: partsUsed.trim() || 'لا يوجد',
      },
      finalStatus,
      mechanicName: bi(provider.ownerName, lang),
      providerName: provider.name,
      matchedAiPrediction: matchedAi,
      reviewStatus: matchedAi ? 'verified' : 'needs_review',
    });

    setActualFault('');
    setFailedComponent('');
    setRepairPerformed('');
    setPartsUsed('');
    showToast(t(lang, 'feedbackSavedToast'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {t(lang, 'providerFeedbackNav')}
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          {lang === 'ar'
            ? 'تسجيل الأعطال الفعلية والقطع المستبدلة لتحسين دقة قاعدة معرفة التشخيص الذكي.'
            : 'Record confirmed mechanical faults and parts used to strengthen the platform diagnostic dataset.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Feedback Submission Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-[#172B3A] flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-[#0F766E]" />
            <span>{t(lang, 'submitFeedbackBtn')}</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'providerRequestsNav')}
            </label>
            <select
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {bookings.map((bk) => (
                <option key={bk.id} value={bk.id}>
                  {bk.id} — {bk.vehicleSummary} ({bk.customerName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'actualFaultLabel')} *
            </label>
            <input
              required
              value={actualFault}
              onChange={(e) => setActualFault(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'مثال: تلف منظم جهد الدينامو الداخلي'
                  : 'e.g., Internal alternator voltage regulator failure'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'failedComponentLabel')} *
            </label>
            <input
              required
              value={failedComponent}
              onChange={(e) => setFailedComponent(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: الدينامو 130 أمبير' : 'e.g., 130A Alternator Assembly'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-1">
              {t(lang, 'repairPerformedLabel')} *
            </label>
            <textarea
              required
              rows={2}
              value={repairPerformed}
              onChange={(e) => setRepairPerformed(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'تبديل الدينامو وفحص شحن البطارية تحت الحمل...'
                  : 'Replaced alternator assembly and verified 14.2V charging under load...'
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                {t(lang, 'partsUsedLabel')}
              </label>
              <input
                value={partsUsed}
                onChange={(e) => setPartsUsed(e.target.value)}
                placeholder="Denso OEM Alternator"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                {t(lang, 'finalStatusLabel')}
              </label>
              <select
                value={finalStatus}
                onChange={(e) =>
                  setFinalStatus(e.target.value as 'resolved' | 'follow_up_required')
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="resolved">{t(lang, 'resolvedLabel')}</option>
                <option value="follow_up_required">{t(lang, 'followUpLabel')}</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-[#172B3A] cursor-pointer">
            <input
              type="checkbox"
              checked={matchedAi}
              onChange={(e) => setMatchedAi(e.target.checked)}
              className="accent-[#0F766E]"
            />
            <span>
              {lang === 'ar'
                ? 'التشخيص الفعلي طابق توقع الذكاء الاصطناعي المبدئي'
                : 'Confirmed diagnosis matched initial AI prediction'}
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold cursor-pointer"
          >
            {t(lang, 'submitFeedbackBtn')}
          </button>
        </form>

        {/* Submitted Knowledge Base Logs */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-[#172B3A]">
            {lang === 'ar' ? 'سجلات التغذية الراجعة المرسلة' : 'Submitted Diagnostic Records'}
          </h2>
          <div className="divide-y divide-slate-100">
            {feedbackRecords.map((rec) => (
              <div key={rec.id} className="py-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#172B3A]">
                    {rec.vehicleSummary}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t(lang, 'resolvedLabel')}</span>
                  </span>
                </div>
                <p className="text-xs text-[#0F766E] font-semibold">
                  {bi(rec.actualDiagnosedFault, lang)}
                </p>
                <p className="text-xs text-[#64748B]">{bi(rec.repairPerformed, lang)}</p>
                <p className="text-[11px] font-mono text-[#64748B] tabular-nums">
                  {rec.submittedAt} · {bi(rec.sparePartsUsed, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
