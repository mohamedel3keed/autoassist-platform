import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Package, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { OrderStatus, SparePartProduct } from '../../types/platform';
import { OrderStatusBadge } from '../shared/StatusLabel';

export const SparePartsInventory: React.FC = () => {
  const { lang, spareParts, sparePartOrders, setProviderSection } = usePlatform();

  const totalSkus = spareParts.length;
  const totalUnits = spareParts.reduce((acc, p) => acc + p.quantity, 0);
  const lowOrOut = spareParts.filter((p) => p.status !== 'in_stock').length;
  const pendingOrders = sparePartOrders.filter((o) => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {t(lang, 'providerInventoryNav')}
        </h1>
        <button
          type="button"
          onClick={() => setProviderSection('products')}
          className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-semibold cursor-pointer"
        >
          {t(lang, 'providerProductsNav')}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <p className="text-xs text-[#64748B]">{t(lang, 'providerProductsNav')}</p>
          <p className="text-2xl font-bold text-[#172B3A] tabular-nums">{totalSkus}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <p className="text-xs text-[#64748B]">{t(lang, 'productQtyLabel')}</p>
          <p className="text-2xl font-bold text-[#172B3A] tabular-nums">{totalUnits}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <p className="text-xs text-[#64748B]">{t(lang, 'lowStock')}</p>
          <p className="text-2xl font-bold text-amber-700 tabular-nums">{lowOrOut}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <p className="text-xs text-[#64748B]">{t(lang, 'pendingRequests')}</p>
          <p className="text-2xl font-bold text-[#0F766E] tabular-nums">{pendingOrders}</p>
        </div>
      </div>

      {/* Low Stock Watchlist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <h2 className="text-sm font-bold text-[#172B3A] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{t(lang, 'stockStatusLabel')}</span>
        </h2>
        <div className="divide-y divide-slate-100">
          {spareParts.map((part) => (
            <div key={part.id} className="py-3 flex items-center justify-between gap-3 text-sm">
              <div>
                <p className="font-semibold text-[#172B3A]">{bi(part.name, lang)}</p>
                <p className="text-xs text-[#64748B] font-mono">
                  {part.sku} · {part.compatibleMakes.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-mono font-bold text-[#172B3A] tabular-nums">
                  {part.quantity}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    part.status === 'in_stock'
                      ? 'text-emerald-700'
                      : part.status === 'low_stock'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  {part.status === 'in_stock'
                    ? t(lang, 'inStock')
                    : part.status === 'low_stock'
                    ? t(lang, 'lowStock')
                    : t(lang, 'outOfStock')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SparePartsProducts: React.FC = () => {
  const { lang, spareParts, addSparePart, updateSparePart, deleteSparePart, showToast } =
    usePlatform();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SparePartProduct | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [categoryEn, setCategoryEn] = useState('Electrical & Charging');
  const [makes, setMakes] = useState('Toyota, Hyundai');
  const [models, setModels] = useState('Camry, Tucson');
  const [priceSar, setPriceSar] = useState('250');
  const [quantity, setQuantity] = useState('10');

  const openAdd = () => {
    setEditing(null);
    setNameEn('');
    setNameAr('');
    setCategoryEn('Electrical & Charging');
    setMakes('Toyota, Hyundai');
    setModels('Camry, Tucson');
    setPriceSar('250');
    setQuantity('10');
    setModalOpen(true);
  };

  const openEdit = (p: SparePartProduct) => {
    setEditing(p);
    setNameEn(p.name.en);
    setNameAr(p.name.ar);
    setCategoryEn(p.category.en);
    setMakes(p.compatibleMakes.join(', '));
    setModels(p.compatibleModels.join(', '));
    setPriceSar(String(p.priceSar));
    setQuantity(String(p.quantity));
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;
    const makesArr = makes.split(',').map((s) => s.trim()).filter(Boolean);
    const modelsArr = models.split(',').map((s) => s.trim()).filter(Boolean);

    if (editing) {
      updateSparePart({
        ...editing,
        name: { en: nameEn.trim(), ar: nameAr.trim() || nameEn.trim() },
        category: { en: categoryEn.trim(), ar: categoryEn.trim() },
        compatibleMakes: makesArr,
        compatibleModels: modelsArr,
        priceSar: Number(priceSar) || 0,
        quantity: Number(quantity) || 0,
      });
      showToast(lang === 'ar' ? 'تم تحديث القطعة.' : 'Product updated.');
    } else {
      addSparePart({
        name: { en: nameEn.trim(), ar: nameAr.trim() || nameEn.trim() },
        sku: `PRT-${Math.floor(1000 + Math.random() * 8999)}`,
        category: { en: categoryEn.trim(), ar: categoryEn.trim() },
        compatibleMakes: makesArr,
        compatibleModels: modelsArr,
        priceSar: Number(priceSar) || 0,
        quantity: Number(quantity) || 0,
      });
      showToast(lang === 'ar' ? 'تمت إضافة القطعة للمخزون.' : 'Product added to inventory.');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
          {t(lang, 'providerProductsNav')}
        </h1>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t(lang, 'addProductBtn')}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-4 text-start">{t(lang, 'productNameLabel')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'productCategoryLabel')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'supportedBrandsLabel')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'productPriceLabel')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'productQtyLabel')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'stockStatusLabel')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'edit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {spareParts.map((part) => (
                <tr key={part.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#172B3A]">{bi(part.name, lang)}</p>
                    <p className="text-[11px] font-mono text-[#64748B]">{part.sku}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">{bi(part.category, lang)}</td>
                  <td className="py-3.5 px-4 text-xs text-[#172B3A]">
                    {part.compatibleMakes.join(', ')} · {part.compatibleModels.join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-end font-mono font-semibold text-[#172B3A] tabular-nums">
                    {part.priceSar}
                  </td>
                  <td className="py-3.5 px-4 text-end font-mono tabular-nums">{part.quantity}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        part.status === 'in_stock'
                          ? 'text-emerald-700'
                          : part.status === 'low_stock'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {part.status === 'in_stock' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {part.status === 'in_stock'
                          ? t(lang, 'inStock')
                          : part.status === 'low_stock'
                          ? t(lang, 'lowStock')
                          : t(lang, 'outOfStock')}
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(part)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-[#172B3A] cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSparePart(part.id)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172B3A] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0F766E]" />
                <span>{editing ? t(lang, 'edit') : t(lang, 'addProductBtn')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'productNameLabel')} (EN) *
                  </label>
                  <input
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'productNameLabel')} (AR)
                  </label>
                  <input
                    dir="rtl"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'productCategoryLabel')}
                  </label>
                  <input
                    value={categoryEn}
                    onChange={(e) => setCategoryEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'productPriceLabel')}
                  </label>
                  <input
                    type="number"
                    required
                    value={priceSar}
                    onChange={(e) => setPriceSar(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'productQtyLabel')}
                  </label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm tabular-nums"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'supportedMakesLabel')}
                  </label>
                  <input
                    value={makes}
                    onChange={(e) => setMakes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'supportedModelsLabel')}
                  </label>
                  <input
                    value={models}
                    onChange={(e) => setModels(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-[#64748B] cursor-pointer"
                >
                  {t(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-semibold cursor-pointer"
                >
                  {t(lang, 'save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const SparePartsOrders: React.FC = () => {
  const { lang, sparePartOrders, updateOrderStatus, showToast } = usePlatform();
  const statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
        {t(lang, 'providerOrdersNav')}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                <th className="py-3 px-4 text-start">ID</th>
                <th className="py-3 px-4 text-start">{t(lang, 'fullName')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'productNameLabel')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'productQtyLabel')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'productPriceLabel')}</th>
                <th className="py-3 px-4 text-start">{t(lang, 'appointmentStatus')}</th>
                <th className="py-3 px-4 text-end">{t(lang, 'updateStatusLabel')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {sparePartOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono text-xs text-[#64748B]">{ord.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#172B3A]">{ord.customerName}</p>
                    <p className="text-xs text-[#64748B]">{ord.vehicleInfo}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#172B3A]">{bi(ord.productName, lang)}</td>
                  <td className="py-3.5 px-4 text-end font-mono tabular-nums">{ord.quantity}</td>
                  <td className="py-3.5 px-4 text-end font-mono font-semibold tabular-nums">
                    {ord.totalSar}
                  </td>
                  <td className="py-3.5 px-4">
                    <OrderStatusBadge status={ord.status} />
                  </td>
                  <td className="py-3.5 px-4 text-end">
                    <select
                      value={ord.status}
                      onChange={(e) => {
                        updateOrderStatus(ord.id, e.target.value as OrderStatus);
                        showToast(lang === 'ar' ? 'تم تحديث حالة الطلب.' : 'Order status updated.');
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
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
