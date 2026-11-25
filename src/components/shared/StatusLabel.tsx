import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Wrench } from 'lucide-react';
import { BookingStatus, LikelihoodLevel, OrderStatus } from '../../types/platform';
import { usePlatform } from '../../context/PlatformContext';
import { t } from '../../i18n/translations';

export const BookingStatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const { lang } = usePlatform();

  const config: Record<
    BookingStatus,
    { label: string; colorClass: string; icon: React.ReactNode }
  > = {
    pending: {
      label: t(lang, 'pending'),
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
    },
    accepted: {
      label: t(lang, 'accepted'),
      colorClass: 'text-[#0F766E] bg-[#DCEFEF] border-[#0F766E]/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    },
    in_progress: {
      label: t(lang, 'inProgress'),
      colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
      icon: <Wrench className="w-3.5 h-3.5 shrink-0" />,
    },
    completed: {
      label: t(lang, 'completed'),
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    },
    rejected: {
      label: t(lang, 'rejected'),
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 shrink-0" />,
    },
  };

  const item = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap ${item.colorClass}`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};

export const LikelihoodLabel: React.FC<{ level: LikelihoodLevel }> = ({ level }) => {
  const { lang } = usePlatform();
  const map: Record<LikelihoodLevel, { text: string; cls: string; icon: React.ReactNode }> = {
    high: {
      text: t(lang, 'likelihoodHigh'),
      cls: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
    },
    medium: {
      text: t(lang, 'likelihoodMedium'),
      cls: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
    },
    low: {
      text: t(lang, 'likelihoodLow'),
      cls: 'text-slate-600 bg-slate-100 border-slate-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    },
  };

  const item = map[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold whitespace-nowrap ${item.cls}`}
    >
      {item.icon}
      <span>{item.text}</span>
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const { lang } = usePlatform();
  const labels: Record<OrderStatus, { en: string; ar: string; cls: string }> = {
    pending: { en: 'Pending', ar: 'قيد الانتظار', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
    confirmed: { en: 'Confirmed', ar: 'مؤكد', cls: 'text-[#0F766E] bg-[#DCEFEF] border-[#0F766E]/20' },
    shipped: { en: 'Shipped', ar: 'تم الشحن', cls: 'text-sky-700 bg-sky-50 border-sky-200' },
    delivered: { en: 'Delivered', ar: 'تم التسليم', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  };
  const item = labels[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap ${item.cls}`}>
      {item[lang]}
    </span>
  );
};
