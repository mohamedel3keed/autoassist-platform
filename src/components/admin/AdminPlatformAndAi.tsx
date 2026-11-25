import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Plus, EyeOff, Check } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { CleanBarChart, HorizontalBreakdownList } from '../shared/SimpleCharts';

export const AdminPlatformManage: React.FC = () => {
  const {
    lang,
    serviceCatalog,
    addServiceCategory,
    toggleServiceCategory,
    brandCatalog,
    addBrandModel,
    userReports,
    updateUserReportStatus,
    providers,
    moderateReview,
    showToast,
  } = usePlatform();

  const [tab, setTab] = useState<'categories' | 'brands' | 'reports' | 'reviews'>('categories');
  const [catEn, setCatEn] = useState('');
  const [catAr, setCatAr] = useState('');
  const [newMake, setNewMake] = useState('Toyota');
  const [newModel, setNewModel] = useState('');

  const allReviews = providers.flatMap((p) =>
    p.reviews.map((r) => ({ ...r, providerId: p.id, providerName: p.name }))
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
        {t(lang, 'adminPlatform')}
      </h1>

      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { id: 'categories' as const, label: t(lang, 'serviceCategoriesTab') },
          { id: 'brands' as const, label: t(lang, 'vehicleCatalogTab') },
          { id: 'reports' as const, label: t(lang, 'userReportsTab') },
          { id: 'reviews' as const, label: t(lang, 'reviewsModerationTab') },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === item.id ? 'bg-white text-[#172B3A] shadow-sm' : 'text-[#64748B]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Service Categories */}
      {tab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={catEn}
              onChange={(e) => setCatEn(e.target.value)}
              placeholder="Category Name (EN)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <input
              value={catAr}
              onChange={(e) => setCatAr(e.target.value)}
              dir="rtl"
              placeholder="اسم الفئة (AR)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                if (!catEn.trim()) return;
                addServiceCategory(catEn.trim(), catAr.trim() || catEn.trim());
                setCatEn('');
                setCatAr('');
                showToast(lang === 'ar' ? 'تمت إضافة الفئة.' : 'Category added.');
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t(lang, 'add')}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {serviceCatalog.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between text-sm">
                <span className="font-medium text-[#172B3A]">
                  {lang === 'ar' ? c.ar : c.en}
                </span>
                <button
                  type="button"
                  onClick={() => toggleServiceCategory(c.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    c.active ? 'bg-[#DCEFEF] text-[#0F766E]' : 'bg-slate-100 text-[#64748B]'
                  }`}
                >
                  {c.active ? t(lang, 'activeStatus') : t(lang, 'inactiveStatus')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Brands & Models */}
      {tab === 'brands' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={newMake}
              onChange={(e) => setNewMake(e.target.value)}
              placeholder={t(lang, 'vehicleMake')}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <input
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              placeholder={t(lang, 'vehicleModel')}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                if (!newMake.trim() || !newModel.trim()) return;
                addBrandModel(newMake.trim(), newModel.trim());
                setNewModel('');
                showToast(lang === 'ar' ? 'تمت إضافة الموديل.' : 'Brand/model added.');
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t(lang, 'add')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandCatalog.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                <h3 className="text-sm font-bold text-[#172B3A]">{b.make}</h3>
                <p className="text-xs text-[#64748B]">{b.models.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Reports */}
      {tab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {userReports.map((rep) => (
            <div key={rep.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#172B3A]">{bi(rep.targetName, lang)}</p>
                <p className="text-xs text-[#64748B]">{bi(rep.reason, lang)}</p>
                <p className="text-[11px] text-[#64748B]">
                  {rep.reporter} · {rep.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {rep.status === 'open' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => updateUserReportStatus(rep.id, 'resolved')}
                      className="px-3 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
                    >
                      {t(lang, 'resolvedLabel')}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateUserReportStatus(rep.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#64748B] cursor-pointer"
                    >
                      {t(lang, 'cancel')}
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 capitalize">
                    {rep.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Moderation */}
      {tab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {allReviews.map((rev) => (
            <div key={rev.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#0F766E]">
                  {bi(rev.providerName, lang)} · {rev.author} ({rev.rating}★)
                </p>
                <p className="text-sm text-[#172B3A]">{bi(rev.comment, lang)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => moderateReview(rev.providerId, rev.id, 'approved')}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    rev.status === 'approved'
                      ? 'bg-[#DCEFEF] text-[#0F766E]'
                      : 'border border-slate-200 text-[#64748B]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t(lang, 'accepted')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => moderateReview(rev.providerId, rev.id, 'hidden')}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    rev.status === 'hidden'
                      ? 'bg-rose-50 text-rose-700'
                      : 'border border-slate-200 text-[#64748B]'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إخفاء' : 'Hide'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminAiMonitoring: React.FC = () => {
  const { lang, reports, feedbackRecords, markFeedbackReviewed, showToast } = usePlatform();

  const totalSessions = reports.length + 840;
  const needsReviewCount = feedbackRecords.filter((f) => f.reviewStatus === 'needs_review').length;

  const topProblems = [
    { label: lang === 'ar' ? 'توقف مفاجئ / لا يعمل' : 'Stalling / No-start', value: 245, highlight: true },
    { label: lang === 'ar' ? 'ارتفاع الحرارة' : 'Overheating', value: 184 },
    { label: lang === 'ar' ? 'صفير المكابح' : 'Brake squeal', value: 162 },
    { label: lang === 'ar' ? 'لمبة المكينة' : 'Check engine light', value: 138 },
  ];

  const predictedFaults = [
    { label: lang === 'ar' ? 'الدينامو / البطارية' : 'Alternator / 12V Battery', count: 210, total: 640 },
    { label: lang === 'ar' ? 'مروحة التبريد / الثيرموستات' : 'Cooling Fan / Thermostat', count: 165, total: 640 },
    { label: lang === 'ar' ? 'تآكل فحمات المكابح' : 'Worn Brake Pads', count: 148, total: 640 },
    { label: lang === 'ar' ? 'ملفات الإشعال / البواجي' : 'Ignition Coils / Plugs', count: 117, total: 640 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
            {t(lang, 'adminAiMonitoring')}
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            {lang === 'ar'
              ? 'فصل واضح بين توقعات الذكاء الاصطناعي الأولية والتشخيص الميكانيكي المؤكد من الورش.'
              : 'Clear distinction between AI initial predictions and confirmed mechanical diagnoses from workshops.'}
          </p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <p className="text-xs text-[#64748B]">{t(lang, 'totalDiagnosticsMetric')}</p>
          <p className="text-2xl font-bold text-[#172B3A] tabular-nums">{totalSessions}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <p className="text-xs text-[#64748B]">{t(lang, 'providerFeedbackNav')}</p>
          <p className="text-2xl font-bold text-[#0F766E] tabular-nums">
            {feedbackRecords.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <p className="text-xs text-[#64748B]">{t(lang, 'casesRequiringReview')}</p>
          <p className="text-2xl font-bold text-amber-700 tabular-nums">{needsReviewCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'frequentProblemsChart')}
          </h2>
          <CleanBarChart data={topProblems} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'frequentFaultsChart')}
          </h2>
          <HorizontalBreakdownList items={predictedFaults} />
        </div>
      </div>

      {/* AI Predictions vs Confirmed Mechanical Diagnoses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-[#172B3A]">{t(lang, 'aiVsConfirmedTitle')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-4 text-start">{t(lang, 'activeVehicleContext')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'aiPredictedCol')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'confirmedFaultCol')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'appointmentStatus')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'casesRequiringReview')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {feedbackRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#172B3A]">{rec.vehicleSummary}</p>
                    <p className="text-[11px] text-[#64748B]">{bi(rec.providerName, lang)}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">
                    {bi(rec.aiPredictedFault, lang)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#172B3A]">
                    {bi(rec.actualDiagnosedFault, lang)}
                  </td>
                  <td className="py-3.5 px-4">
                    {rec.reviewStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t(lang, 'verified')}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{t(lang, 'casesRequiringReview')}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-end">
                    {rec.reviewStatus === 'needs_review' ? (
                      <button
                        type="button"
                        onClick={() => {
                          markFeedbackReviewed(rec.id);
                          showToast(
                            lang === 'ar'
                              ? 'تم اعتماد السجل في قاعدة البيانات.'
                              : 'Feedback record verified for knowledge base.'
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
                      >
                        {t(lang, 'markReviewed')}
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-[#64748B] tabular-nums">
                        {rec.submittedAt}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
