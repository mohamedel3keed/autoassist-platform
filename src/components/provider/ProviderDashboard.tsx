import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Car,
  ClipboardList,
  MessageSquarePlus,
  Package,
  ShoppingBag,
  Menu,
  X,
  Boxes,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { ProviderSection, ProviderType } from '../../types/platform';
import { ProviderOverview } from './ProviderOverview';
import { ProviderProfileManage } from './ProviderProfileManage';
import { ProviderServicesManage, ProviderCompatibility } from './ProviderServicesAndCompat';
import { ProviderRequests } from './ProviderRequests';
import { ProviderFeedback } from './ProviderFeedback';
import { SparePartsInventory, SparePartsProducts, SparePartsOrders } from './SparePartsModules';

export const ProviderDashboard: React.FC = () => {
  const {
    lang,
    providerDemoType,
    setProviderDemoType,
    providerSection,
    setProviderSection,
    providers,
  } = usePlatform();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeProvider =
    providers.find((p) => p.type === providerDemoType) || providers[0];

  const handleTypeSwitch = (nextType: ProviderType) => {
    setProviderDemoType(nextType);
    if (nextType === 'spare_parts') {
      if (['services', 'compatibility', 'requests', 'feedback'].includes(providerSection)) {
        setProviderSection('inventory');
      }
    } else {
      if (['inventory', 'products', 'orders'].includes(providerSection)) {
        setProviderSection('overview');
      }
    }
  };

  const workshopNav: { id: ProviderSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t(lang, 'providerOverview'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'requests', label: t(lang, 'providerRequestsNav'), icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'services', label: t(lang, 'providerServicesNav'), icon: <Wrench className="w-4 h-4" /> },
    { id: 'compatibility', label: t(lang, 'providerCompatibilityNav'), icon: <Car className="w-4 h-4" /> },
    { id: 'feedback', label: t(lang, 'providerFeedbackNav'), icon: <MessageSquarePlus className="w-4 h-4" /> },
    { id: 'profile', label: t(lang, 'providerProfileNav'), icon: <Building2 className="w-4 h-4" /> },
  ];

  const sparePartsNav: { id: ProviderSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t(lang, 'providerOverview'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'inventory', label: t(lang, 'providerInventoryNav'), icon: <Boxes className="w-4 h-4" /> },
    { id: 'products', label: t(lang, 'providerProductsNav'), icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: t(lang, 'providerOrdersNav'), icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'profile', label: t(lang, 'providerProfileNav'), icon: <Building2 className="w-4 h-4" /> },
  ];

  const navItems = providerDemoType === 'spare_parts' ? sparePartsNav : workshopNav;

  const currentNavLabel =
    navItems.find((n) => n.id === providerSection)?.label || t(lang, 'providerOverview');

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] flex max-w-[1440px] mx-auto">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 bg-white border-e border-slate-200 p-4 justify-between">
        <div className="space-y-6">
          {/* Provider Identity */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1">
            <p className="text-xs font-medium text-[#0F766E]">
              {providerDemoType === 'workshop'
                ? t(lang, 'accountWorkshop')
                : providerDemoType === 'service_center'
                ? t(lang, 'accountServiceCenter')
                : t(lang, 'accountSpareParts')}
            </p>
            <p className="text-sm font-bold text-[#172B3A] truncate">
              {bi(activeProvider.name, lang)}
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = providerSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProviderSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#DCEFEF] text-[#0F766E] font-semibold'
                      : 'text-[#64748B] hover:bg-slate-50 hover:text-[#172B3A]'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Provider Account Type Demo Switcher */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-semibold text-[#64748B]">
            {t(lang, 'switchProviderType')}
          </label>
          <select
            value={providerDemoType}
            onChange={(e) => handleTypeSwitch(e.target.value as ProviderType)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#172B3A] focus:outline-none focus:border-[#0F766E]"
          >
            <option value="workshop">{t(lang, 'catWorkshops')}</option>
            <option value="service_center">{t(lang, 'catServiceCenters')}</option>
            <option value="spare_parts">{t(lang, 'catSpareParts')}</option>
          </select>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#172B3A]/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full p-4 flex flex-col justify-between z-10 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-[#172B3A]">
                  {bi(activeProvider.name, lang)}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#64748B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setProviderSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                      providerSection === item.id
                        ? 'bg-[#DCEFEF] text-[#0F766E] font-semibold'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <select
                value={providerDemoType}
                onChange={(e) => handleTypeSwitch(e.target.value as ProviderType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="workshop">{t(lang, 'catWorkshops')}</option>
                <option value="service_center">{t(lang, 'catServiceCenters')}</option>
                <option value="spare_parts">{t(lang, 'catSpareParts')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Context Header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 h-13 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-[#172B3A]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm truncate">
              <span className="text-[#64748B]">{t(lang, 'roleProvider')}</span>
              <span className="text-[#64748B]">/</span>
              <span className="font-bold text-[#172B3A] truncate">{currentNavLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={providerDemoType}
              onChange={(e) => handleTypeSwitch(e.target.value as ProviderType)}
              aria-label={t(lang, 'switchProviderType')}
              className="lg:hidden px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#172B3A]"
            >
              <option value="workshop">{t(lang, 'catWorkshops')}</option>
              <option value="service_center">{t(lang, 'catServiceCenters')}</option>
              <option value="spare_parts">{t(lang, 'catSpareParts')}</option>
            </select>
            <span className="text-xs font-medium text-[#0F766E] bg-[#DCEFEF] px-2.5 py-1 rounded-lg whitespace-nowrap">
              {t(lang, 'sampleDataBadge')}
            </span>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6">
          {providerSection === 'overview' && <ProviderOverview provider={activeProvider} />}
          {providerSection === 'profile' && <ProviderProfileManage provider={activeProvider} />}
          {providerSection === 'services' && <ProviderServicesManage provider={activeProvider} />}
          {providerSection === 'compatibility' && (
            <ProviderCompatibility provider={activeProvider} />
          )}
          {providerSection === 'requests' && <ProviderRequests provider={activeProvider} />}
          {providerSection === 'feedback' && <ProviderFeedback provider={activeProvider} />}
          {providerSection === 'inventory' && <SparePartsInventory />}
          {providerSection === 'products' && <SparePartsProducts />}
          {providerSection === 'orders' && <SparePartsOrders />}
        </main>
      </div>
    </div>
  );
};
