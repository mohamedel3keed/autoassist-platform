import React from 'react';
import {
  ShieldAlert,
  Bookmark,
  CheckCircle2,
  MapPin,
  Wrench,
  Cpu,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { LikelihoodLabel } from '../shared/StatusLabel';

export const OwnerDiagnosticReport: React.FC = () => {
  const {
    lang,
    reports,
    activeReportId,
    saveReport,
    openExploreWithFilter,
    setOwnerTab,
    vehicles,
    showToast,
  } = usePlatform();

  const report = reports.find((r) => r.id === activeReportId) || reports[0];
  const isRtl = lang === 'ar';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  if (!report) return null;

  const matchedVehicle = vehicles.find((v) => v.id === report.vehicleId);

  const riskConfig = {
    high: {
      label: t(lang, 'riskHigh'),
      cls: 'bg-rose-50 border-rose-200 text-rose-800',
    },
    moderate: {
      label: t(lang, 'riskModerate'),
      cls: 'bg-amber-50 border-amber-200 text-amber-800',
    },
    low: {
      label: t(lang, 'riskLow'),
      cls: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
  }[report.riskLevel];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOwnerTab('ai_chat')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#172B3A] cursor-pointer"
        >
          <BackArrow className="w-4 h-4" />
          <span>{t(lang, 'aiAssistantTitle')}</span>
        </button>

        <span className="text-xs font-mono text-[#64748B] tabular-nums">
          {report.vehicleLabel} · {report.createdAt}
        </span>
      </div>

      {/* Report Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#172B3A]">{t(lang, 'reportTitle')}</h1>
            <p className="text-xs text-[#64748B] mt-1">{t(lang, 'qualitativeNotice')}</p>
          </div>
          <div className={`px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 ${riskConfig.cls}`}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{riskConfig.label}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5">
          <h2 className="text-xs font-bold text-[#64748B]">{t(lang, 'reportSummary')}</h2>
          <p className="text-sm text-[#172B3A] leading-relaxed">{bi(report.summary, lang)}</p>
        </div>

        {/* Reported Symptoms + Linked OBD Codes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-[#64748B] mb-2">
              {t(lang, 'reportedSymptoms')}
            </h3>
            <ul className="space-y-1.5 text-sm text-[#172B3A]">
              {report.reportedSymptoms.map((sym, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#0F766E] font-bold">·</span>
                  <span>{bi(sym, lang)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-[#64748B] mb-1">
                {t(lang, 'recommendedServiceCategory')}
              </h3>
              <p className="text-sm font-semibold text-[#0F766E]">
                {report.recommendedCategory === 'workshop'
                  ? t(lang, 'catWorkshops')
                  : report.recommendedCategory === 'service_center'
                  ? t(lang, 'catServiceCenters')
                  : t(lang, 'catSpareParts')}{' '}
                · {report.recommendedServiceTag}
              </p>
            </div>

            {report.linkedDtcCodes && report.linkedDtcCodes.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[#64748B] mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>OBD-II DTCs</span>
                </h3>
                <p className="font-mono text-xs font-semibold text-[#172B3A]">
                  {report.linkedDtcCodes.join(' · ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-rose-900">{t(lang, 'safetyNoticeTitle')}</h3>
          <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
            {bi(report.safetyNotice, lang)}
          </p>
        </div>
      </div>

      {/* Possible Causes Ranked Qualitatively */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#172B3A]">{t(lang, 'possibleCausesTitle')}</h2>
        <div className="space-y-3">
          {report.causes.map((cause, idx) => (
            <div
              key={cause.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-[#172B3A]">
                  {idx + 1}. {bi(cause.title, lang)}
                </h3>
                <LikelihoodLabel level={cause.likelihood} />
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {bi(cause.explanation, lang)}
              </p>
              <p className="text-xs font-medium text-[#172B3A] pt-1">
                {t(lang, 'recommendedInspection')}:{' '}
                <span className="text-[#0F766E]">{bi(cause.estimatedInspection, lang)}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Inspection Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-3">
        <Wrench className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-[#172B3A]">{t(lang, 'recommendedInspection')}</h3>
          <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
            {bi(report.recommendedInspection, lang)}
          </p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() =>
            openExploreWithFilter({
              serviceType: report.recommendedCategory,
              brand: matchedVehicle?.make || 'all',
            })
          }
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-bold transition-colors cursor-pointer min-h-[48px]"
        >
          <MapPin className="w-4 h-4" />
          <span>{t(lang, 'findNearbyWorkshopsBtn')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            saveReport(report.id);
            showToast(
              lang === 'ar'
                ? 'تم حفظ التقرير في سجل الصيانة.'
                : 'Diagnostic report saved to History.'
            );
          }}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer min-h-[48px] ${
            report.saved
              ? 'bg-[#DCEFEF] border-[#0F766E]/30 text-[#0F766E]'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-[#172B3A]'
          }`}
        >
          {report.saved ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          <span>{report.saved ? t(lang, 'reportSavedBtn') : t(lang, 'saveReportBtn')}</span>
        </button>
      </div>
    </div>
  );
};
