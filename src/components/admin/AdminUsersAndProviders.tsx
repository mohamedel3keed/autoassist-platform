import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  FileCheck,
  X,
  UserCheck,
  UserX,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { PlatformUser, Provider, ProviderType } from '../../types/platform';

export const AdminUsers: React.FC = () => {
  const { lang, users, toggleUserActive, showToast } = usePlatform();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">{t(lang, 'adminUsers')}</h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, 'search')}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#172B3A]"
        >
          <option value="all">{t(lang, 'all')}</option>
          <option value="car_owner">{t(lang, 'accountCarOwner')}</option>
          <option value="workshop">{t(lang, 'accountWorkshop')}</option>
          <option value="service_center">{t(lang, 'accountServiceCenter')}</option>
          <option value="spare_parts">{t(lang, 'accountSpareParts')}</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-4 text-start">{t(lang, 'fullName')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'email')}</th>
                <th className="py-3 px-4 text-start">Role</th>
                <th className="py-3 px-4 text-start">{t(lang, 'appointmentStatus')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'bookingDetails')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-semibold text-[#172B3A]">{u.fullName}</td>
                  <td className="py-3.5 px-4 text-[#64748B]">{u.email}</td>
                  <td className="py-3.5 px-4 text-[#172B3A]">
                    {u.role === 'car_owner'
                      ? t(lang, 'accountCarOwner')
                      : u.role === 'workshop'
                      ? t(lang, 'accountWorkshop')
                      : u.role === 'service_center'
                      ? t(lang, 'accountServiceCenter')
                      : t(lang, 'accountSpareParts')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        u.active ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {u.active ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      <span>{u.active ? t(lang, 'activeStatus') : t(lang, 'inactiveStatus')}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#172B3A] cursor-pointer"
                      >
                        {t(lang, 'bookingDetails')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toggleUserActive(u.id);
                          showToast(
                            u.active
                              ? lang === 'ar'
                                ? 'تم إيقاف الحساب.'
                                : 'Account deactivated.'
                              : lang === 'ar'
                              ? 'تم تفعيل الحساب.'
                              : 'Account activated.'
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          u.active
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-[#DCEFEF] text-[#0F766E] hover:bg-[#cbe6e6]'
                        }`}
                      >
                        {u.active ? t(lang, 'deactivateAccount') : t(lang, 'activateAccount')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172B3A]">{selectedUser.fullName}</h3>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-xs text-[#64748B]">{selectedUser.email}</p>
              <p className="text-xs font-mono text-[#172B3A]">{selectedUser.phone}</p>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC]">
                  <p className="text-base font-bold tabular-nums">{selectedUser.vehiclesCount}</p>
                  <p className="text-[11px] text-[#64748B]">{t(lang, 'navGarage')}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC]">
                  <p className="text-base font-bold tabular-nums">{selectedUser.bookingsCount}</p>
                  <p className="text-[11px] text-[#64748B]">{t(lang, 'tabBookings')}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC]">
                  <p className="text-xs font-bold">{bi(selectedUser.city, lang)}</p>
                  <p className="text-[11px] text-[#64748B]">{selectedUser.joinedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminProviders: React.FC = () => {
  const { lang, providers, verifyProvider, showToast } = usePlatform();
  const [typeFilter, setTypeFilter] = useState<ProviderType | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const filtered = providers.filter((p) => typeFilter === 'all' || p.type === typeFilter);

  const handleDecision = (id: string, status: 'verified' | 'rejected') => {
    verifyProvider(id, status);
    if (selectedProvider?.id === id) {
      setSelectedProvider({
        ...selectedProvider,
        verified: status === 'verified',
        verificationStatus: status,
      });
    }
    showToast(
      status === 'verified'
        ? lang === 'ar'
          ? 'تم اعتماد وتوثيق مزود الخدمة.'
          : 'Provider account verified and published.'
        : lang === 'ar'
        ? 'تم رفض طلب مزود الخدمة.'
        : 'Provider application rejected.'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {t(lang, 'adminProviders')}
        </h1>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {(['all', 'workshop', 'service_center', 'spare_parts'] as const).map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => setTypeFilter(tp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                typeFilter === tp ? 'bg-white text-[#172B3A] shadow-sm' : 'text-[#64748B]'
              }`}
            >
              {tp === 'all'
                ? t(lang, 'all')
                : tp === 'workshop'
                ? t(lang, 'catWorkshops')
                : tp === 'service_center'
                ? t(lang, 'catServiceCenters')
                : t(lang, 'catSpareParts')}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Locations Map Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#172B3A]">{t(lang, 'simulatedMapLabel')}</span>
          <span className="text-[#64748B] tabular-nums">{filtered.length} providers</span>
        </div>
        <div className="relative h-44 rounded-xl bg-[#EFF6F6] border border-slate-200 overflow-hidden">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedProvider(p)}
              style={{ left: `${p.mapCoords.x}%`, top: `${p.mapCoords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-white border border-slate-300 shadow-sm text-[11px] font-semibold text-[#172B3A] hover:border-[#0F766E] flex items-center gap-1 cursor-pointer"
            >
              <MapPin
                className={`w-3 h-3 ${
                  p.verificationStatus === 'verified' ? 'text-[#0F766E]' : 'text-amber-600'
                }`}
              />
              <span className="max-w-[110px] truncate">{bi(p.name, lang)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Providers List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-4 text-start">{t(lang, 'businessNameLabel')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'ownerInfoLabel')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'filterServiceType')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'appointmentStatus')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'bookingDetails')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-bold text-[#172B3A]">{bi(p.name, lang)}</td>
                  <td className="py-3.5 px-4 text-[#64748B]">{bi(p.ownerName, lang)}</td>
                  <td className="py-3.5 px-4 text-[#172B3A]">
                    {p.type === 'workshop'
                      ? t(lang, 'catWorkshops')
                      : p.type === 'service_center'
                      ? t(lang, 'catServiceCenters')
                      : t(lang, 'catSpareParts')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        p.verificationStatus === 'verified'
                          ? 'text-emerald-700'
                          : p.verificationStatus === 'pending'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {p.verificationStatus === 'verified' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : p.verificationStatus === 'rejected' ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : null}
                      <span>
                        {p.verificationStatus === 'verified'
                          ? t(lang, 'verified')
                          : p.verificationStatus === 'pending'
                          ? t(lang, 'pending')
                          : t(lang, 'rejected')}
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedProvider(p)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
                    >
                      {t(lang, 'bookingDetails')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Verify Provider Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172B3A]">
                {bi(selectedProvider.name, lang)}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-[#64748B]">{bi(selectedProvider.description, lang)}</p>
              <p className="text-[#172B3A]">
                <span className="font-semibold">{t(lang, 'ownerInfoLabel')}: </span>
                {bi(selectedProvider.ownerName, lang)}
              </p>
              <p className="text-[#172B3A]">
                <span className="font-semibold">{t(lang, 'addressLabel')}: </span>
                {bi(selectedProvider.address, lang)}
              </p>
              <p className="text-[#172B3A]">
                <span className="font-semibold">{t(lang, 'supportedBrandsLabel')}: </span>
                {selectedProvider.supportedBrands.join(', ')}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <p className="text-xs font-bold text-[#172B3A]">
                {t(lang, 'verificationDocsLabel')}
              </p>
              {selectedProvider.verificationDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <span className="flex items-center gap-1.5 text-[#172B3A]">
                    <FileCheck className="w-4 h-4 text-[#0F766E]" />
                    <span>{bi(doc.name, lang)}</span>
                  </span>
                  <span className="font-semibold text-[#0F766E]">{doc.status}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleDecision(selectedProvider.id, 'rejected')}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
              >
                {t(lang, 'rejectProviderBtn')}
              </button>
              <button
                type="button"
                onClick={() => handleDecision(selectedProvider.id, 'verified')}
                className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-xs font-semibold cursor-pointer"
              >
                {t(lang, 'verifyProviderBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
