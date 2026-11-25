import React from 'react';
import { Users, Wrench, Building2, Package, Bot, CalendarCheck, ShieldAlert } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { CleanBarChart, HorizontalBreakdownList } from '../shared/SimpleCharts';

export const AdminOverview: React.FC = () => {
  const { lang, users, providers, reports, bookings, setAdminSection } = usePlatform();

  const workshopsCount = providers.filter((p) => p.type === 'workshop').length + 24;
  const centersCount = providers.filter((p) => p.type === 'service_center').length + 11;
  const partsCount = providers.filter((p) => p.type === 'spare_parts').length + 16;
  const pendingVerifications = providers.filter((p) => p.verificationStatus === 'pending').length;

  const metrics = [
    { label: t(lang, 'totalUsersMetric'), value: String(users.length + 1240), icon: <Users className="w-4 h-4 text-[#0F766E]" /> },
    { label: t(lang, 'totalWorkshopsMetric'), value: String(workshopsCount), icon: <Wrench className="w-4 h-4 text-[#0F766E]" /> },
    { label: t(lang, 'totalCentersMetric'), value: String(centersCount), icon: <Building2 className="w-4 h-4 text-[#0F766E]" /> },
    { label: t(lang, 'totalPartsMetric'), value: String(partsCount), icon: <Package className="w-4 h-4 text-[#0F766E]" /> },
    { label: t(lang, 'totalDiagnosticsMetric'), value: String(reports.length + 840), icon: <Bot className="w-4 h-4 text-[#0F766E]" /> },
    { label: t(lang, 'totalBookingsMetric'), value: String(bookings.length + 512), icon: <CalendarCheck className="w-4 h-4 text-[#0F766E]" /> },
    {
      label: t(lang, 'pendingVerificationsMetric'),
      value: String(pendingVerifications),
      icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
      highlight: pendingVerifications > 0,
    },
  ];

  const monthlyDiagnostics = [
    { label: lang === 'ar' ? 'يونيو' : 'Jun', value: 94 },
    { label: lang === 'ar' ? 'يوليو' : 'Jul', value: 118 },
    { label: lang === 'ar' ? 'أغسطس' : 'Aug', value: 132 },
    { label: lang === 'ar' ? 'سبتمبر' : 'Sep', value: 156 },
    { label: lang === 'ar' ? 'أكتوبر' : 'Oct', value: 171 },
    { label: lang === 'ar' ? 'نوفمبر' : 'Nov', value: 198, highlight: true },
  ];

  const providerMix = [
    { label: t(lang, 'catWorkshops'), count: workshopsCount, total: workshopsCount + centersCount + partsCount },
    { label: t(lang, 'catServiceCenters'), count: centersCount, total: workshopsCount + centersCount + partsCount },
    { label: t(lang, 'catSpareParts'), count: partsCount, total: workshopsCount + centersCount + partsCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {t(lang, 'adminOverview')}
        </h1>
        {pendingVerifications > 0 && (
          <button
            type="button"
            onClick={() => setAdminSection('providers')}
            className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
          >
            {pendingVerifications} {t(lang, 'pendingVerificationsMetric')}
          </button>
        )}
      </div>

      {/* 7 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border p-4 space-y-2 ${
              m.highlight ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-medium text-[#64748B] truncate">{m.label}</span>
              {m.icon}
            </div>
            <p className="text-2xl font-bold text-[#172B3A] tabular-nums">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'totalDiagnosticsMetric')} — 6M
          </h2>
          <CleanBarChart data={monthlyDiagnostics} />
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'adminProviders')}
          </h2>
          <HorizontalBreakdownList items={providerMix} />
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <h2 className="text-sm font-bold text-[#172B3A]">
          {t(lang, 'providerRecentActivity')}
        </h2>
        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          {providers
            .filter((p) => p.verificationStatus === 'pending')
            .map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <span className="text-[#172B3A]">
                  {lang === 'ar'
                    ? `طلب توثيق معلق: ${bi(p.name, lang)}`
                    : `Pending verification application: ${bi(p.name, lang)}`}
                </span>
                <button
                  type="button"
                  onClick={() => setAdminSection('providers')}
                  className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer shrink-0"
                >
                  {t(lang, 'verifyProviderBtn')}
                </button>
              </div>
            ))}
          {bookings.slice(0, 3).map((b) => (
            <div key={b.id} className="py-3 flex items-center justify-between gap-3">
              <span className="text-[#64748B]">
                {b.customerName} · {bi(b.requestedService, lang)} ({bi(b.providerName, lang)})
              </span>
              <span className="font-mono text-xs text-[#64748B] tabular-nums shrink-0">
                {b.preferredDate}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
