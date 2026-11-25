import React from 'react';
import {
  Users,
  ClipboardList,
  Clock,
  CheckCircle2,
  Star,
  Eye,
  Calendar,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { Provider } from '../../types/platform';
import { CleanBarChart, HorizontalBreakdownList } from '../shared/SimpleCharts';
import { BookingStatusBadge } from '../shared/StatusLabel';

export const ProviderOverview: React.FC<{ provider: Provider }> = ({ provider }) => {
  const { lang, bookings, sparePartOrders, setProviderSection } = usePlatform();

  const isParts = provider.type === 'spare_parts';
  const relevantBookings = bookings.filter((b) => b.providerId === provider.id);
  const pendingCount = isParts
    ? sparePartOrders.filter((o) => o.status === 'pending').length
    : relevantBookings.filter((b) => b.status === 'pending').length;
  const completedCount = isParts
    ? sparePartOrders.filter((o) => o.status === 'delivered').length + 42
    : relevantBookings.filter((b) => b.status === 'completed').length + 38;

  const kpis = [
    {
      label: t(lang, 'totalCustomers'),
      value: isParts ? '184' : '128',
      icon: <Users className="w-4 h-4 text-[#0F766E]" />,
    },
    {
      label: t(lang, 'totalRequests'),
      value: isParts ? String(sparePartOrders.length + 64) : String(relevantBookings.length + 52),
      icon: <ClipboardList className="w-4 h-4 text-[#0F766E]" />,
    },
    {
      label: t(lang, 'pendingRequests'),
      value: String(pendingCount),
      icon: <Clock className="w-4 h-4 text-amber-600" />,
    },
    {
      label: t(lang, 'completedServices'),
      value: String(completedCount),
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: t(lang, 'averageRating'),
      value: String(provider.rating),
      icon: <Star className="w-4 h-4 text-amber-500" />,
    },
    {
      label: t(lang, 'profileViews'),
      value: '1,420',
      icon: <Eye className="w-4 h-4 text-[#0F766E]" />,
    },
  ];

  const monthlyData = [
    { label: lang === 'ar' ? 'يونيو' : 'Jun', value: 18 },
    { label: lang === 'ar' ? 'يوليو' : 'Jul', value: 24 },
    { label: lang === 'ar' ? 'أغسطس' : 'Aug', value: 21 },
    { label: lang === 'ar' ? 'سبتمبر' : 'Sep', value: 29 },
    { label: lang === 'ar' ? 'أكتوبر' : 'Oct', value: 34 },
    { label: lang === 'ar' ? 'نوفمبر' : 'Nov', value: 41, highlight: true },
  ];

  const breakdownItems = isParts
    ? [
        { label: lang === 'ar' ? 'الكهرباء والشحن' : 'Electrical & Charging', count: 28, total: 67 },
        { label: lang === 'ar' ? 'المكابح والهوبات' : 'Brakes & Rotors', count: 22, total: 67 },
        { label: lang === 'ar' ? 'نظام الإشعال' : 'Ignition & Plugs', count: 17, total: 67 },
      ]
    : [
        { label: lang === 'ar' ? 'تشخيص الكهرباء' : 'Electrical Diagnostics', count: 24, total: 54 },
        { label: lang === 'ar' ? 'خدمة المكابح' : 'Brake Service', count: 18, total: 54 },
        { label: lang === 'ar' ? 'فحص المحرك' : 'Engine & Ignition', count: 12, total: 54 },
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {bi(provider.name, lang)} — {t(lang, 'providerOverview')}
        </h1>
      </div>

      {/* 6 KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B] truncate">{kpi.label}</span>
              {kpi.icon}
            </div>
            <p className="text-2xl font-bold text-[#172B3A] tabular-nums">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'monthlyRequestsChart')}
          </h2>
          <CleanBarChart data={monthlyData} />
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'servicesAvailableLabel')}
          </h2>
          <HorizontalBreakdownList items={breakdownItems} />
        </div>
      </div>

      {/* Upcoming Appointments & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#172B3A]">
              {t(lang, 'upcomingAppointments')}
            </h2>
            <button
              type="button"
              onClick={() => setProviderSection(isParts ? 'orders' : 'requests')}
              className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
            >
              {t(lang, 'seeAll')}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {bookings.slice(0, 3).map((bk) => (
              <div key={bk.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#172B3A] truncate">
                    {bk.customerName} · {bk.vehicleSummary}
                  </p>
                  <p className="text-xs text-[#64748B] flex items-center gap-1.5 tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {bk.preferredDate} · {bk.preferredTime}
                    </span>
                  </p>
                </div>
                <BookingStatusBadge status={bk.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#172B3A]">
            {t(lang, 'providerRecentActivity')}
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <span className="text-[#172B3A] font-medium">
                {lang === 'ar'
                  ? 'طلب فحص جديد مع تقرير ذكاء اصطناعي مرفق'
                  : 'New diagnostic booking received with AI report attached'}
              </span>
              <span className="text-[#64748B] shrink-0">12m</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-[#172B3A] font-medium">
                {lang === 'ar'
                  ? 'تم تحديث قائمة العلامات المدعومة (تويوتا، هيونداي)'
                  : 'Supported vehicle compatibility updated (Toyota, Hyundai)'}
              </span>
              <span className="text-[#64748B] shrink-0">2h</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-[#172B3A] font-medium">
                {lang === 'ar'
                  ? 'تقييم عميل جديد 5 نجوم على خدمة الفحص الكهربائي'
                  : 'New 5-star customer review on electrical diagnostic service'}
              </span>
              <span className="text-[#64748B] shrink-0">1d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
