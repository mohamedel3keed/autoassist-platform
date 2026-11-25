import React, { useState } from 'react';
import { Plus, Edit3, CheckCircle2, Cpu, Bot, Trash2, X, Wrench } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { ASSET_IMAGES } from '../../data/mockData';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { BookingStatusBadge } from '../shared/StatusLabel';
import { Vehicle } from '../../types/platform';

export const OwnerGarage: React.FC = () => {
  const {
    lang,
    vehicles,
    activeVehicleId,
    setActiveVehicleId,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    bookings,
    setOwnerTab,
    showToast,
  } = usePlatform();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2022');
  const [engineType, setEngineType] = useState('');
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('Petrol');
  const [transmission, setTransmission] = useState<Vehicle['transmission']>('Automatic');
  const [plateNumber, setPlateNumber] = useState('');
  const [mileageKm, setMileageKm] = useState('35000');

  const openAdd = () => {
    setEditingVehicle(null);
    setMake('');
    setModel('');
    setYear('2023');
    setEngineType('2.0L I4');
    setFuelType('Petrol');
    setTransmission('Automatic');
    setPlateNumber('');
    setMileageKm('20000');
    setModalOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setMake(v.make);
    setModel(v.model);
    setYear(String(v.year));
    setEngineType(v.engineType);
    setFuelType(v.fuelType);
    setTransmission(v.transmission);
    setPlateNumber(v.plateNumber);
    setMileageKm(String(v.mileageKm));
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) return;

    if (editingVehicle) {
      updateVehicle({
        ...editingVehicle,
        make: make.trim(),
        model: model.trim(),
        year: Number(year) || 2022,
        engineType: engineType.trim() || '2.0L',
        fuelType,
        transmission,
        plateNumber: plateNumber.trim() || 'KSA 0000',
        mileageKm: Number(mileageKm) || 0,
      });
      showToast(lang === 'ar' ? 'تم تحديث بيانات السيارة.' : 'Vehicle details updated.');
    } else {
      addVehicle({
        make: make.trim(),
        model: model.trim(),
        year: Number(year) || 2023,
        engineType: engineType.trim() || '2.0L',
        fuelType,
        transmission,
        plateNumber: plateNumber.trim() || 'KSA 2026',
        mileageKm: Number(mileageKm) || 0,
        imageUrl: fuelType === 'Hybrid' ? ASSET_IMAGES.sedan : ASSET_IMAGES.suv,
        color: { en: 'Metallic Slate', ar: 'رمادي معدني' },
        lastServiceDate: new Date().toISOString().slice(0, 10),
      });
      showToast(lang === 'ar' ? 'تمت إضافة السيارة إلى كراجك.' : 'Vehicle added to My Garage.');
    }
    setModalOpen(false);
  };

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];
  const vehicleHistory = activeVehicle
    ? bookings.filter((b) => b.vehicleId === activeVehicle.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#172B3A]">{t(lang, 'myGarageTitle')}</h1>
          <p className="text-sm text-[#64748B]">
            {lang === 'ar'
              ? 'أدر سياراتك واختر المركبة النشطة للتشخيص والورش المتوافقة.'
              : 'Manage your vehicles and select your active car for AI diagnostics and compatible providers.'}
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{t(lang, 'addVehicleBtn')}</span>
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <h2 className="text-base font-bold text-[#172B3A]">{t(lang, 'noVehiclesTitle')}</h2>
          <p className="text-sm text-[#64748B] max-w-md mx-auto">{t(lang, 'noVehiclesDesc')}</p>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t(lang, 'addVehicleBtn')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vehicles.map((v) => {
            const isActive = v.id === activeVehicleId;
            return (
              <div
                key={v.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                  isActive ? 'border-[#0F766E] ring-2 ring-[#0F766E]/15' : 'border-slate-200'
                }`}
              >
                <div className="h-44 relative overflow-hidden">
                  <ImageWithFallback
                    src={v.imageUrl}
                    alt={`${v.year} ${v.make} ${v.model}`}
                    fallbackLabel={`${v.make} ${v.model}`}
                  />
                  {isActive && (
                    <div className="absolute top-3 start-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0F766E] text-white text-xs font-semibold shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t(lang, 'activeVehicleBadge')}</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-[#172B3A]">
                        {v.year} {v.make} {v.model}
                      </h2>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {v.plateNumber} · {bi(v.color, lang)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(v)}
                        aria-label={t(lang, 'edit')}
                        className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-[#172B3A] cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {vehicles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteVehicle(v.id)}
                          aria-label={t(lang, 'delete')}
                          className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-[#64748B] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[#64748B] block">{t(lang, 'fuelType')}</span>
                      <span className="font-semibold text-[#172B3A]">{v.fuelType}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">{t(lang, 'transmissionOptional').replace(' (Optional)', '').replace(' (اختياري)', '')}</span>
                      <span className="font-semibold text-[#172B3A]">{v.transmission}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">{t(lang, 'engineTypeOptional').replace(' (Optional)', '').replace(' (اختياري)', '')}</span>
                      <span className="font-semibold text-[#172B3A]">{v.engineType}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">{t(lang, 'mileageKm')}</span>
                      <span className="font-mono tabular-nums font-semibold text-[#172B3A]">
                        {v.mileageKm.toLocaleString()} km
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => setActiveVehicleId(v.id)}
                        className="px-3.5 py-2 rounded-xl border border-[#0F766E] text-[#0F766E] hover:bg-[#DCEFEF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {t(lang, 'setActiveVehicle')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVehicleId(v.id);
                        setOwnerTab('ai_chat');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{t(lang, 'diagnoseWithAi')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVehicleId(v.id);
                        setOwnerTab('obd');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#172B3A] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>OBD-II</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Vehicle Maintenance History */}
      {activeVehicle && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172B3A] flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#0F766E]" />
              <span>
                {t(lang, 'maintenanceTimeline')} — {activeVehicle.year} {activeVehicle.make}{' '}
                {activeVehicle.model}
              </span>
            </h2>
          </div>

          {vehicleHistory.length === 0 ? (
            <p className="text-sm text-[#64748B]">{t(lang, 'noBookings')}</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {vehicleHistory.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#172B3A]">
                      {bi(item.requestedService, lang)}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {bi(item.providerName, lang)} · {item.preferredDate}
                    </p>
                  </div>
                  <BookingStatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Add / Edit Vehicle Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172B3A]">
                {editingVehicle ? t(lang, 'editVehicleTitle') : t(lang, 'addVehicleBtn')}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'vehicleMake')} *
                  </label>
                  <input
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="Toyota"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'vehicleModel')} *
                  </label>
                  <input
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Camry"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'vehicleYear')} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1990"
                    max="2027"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm tabular-nums focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'fuelType')}
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as Vehicle['fuelType'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#0F766E]"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'engineTypeOptional')}
                  </label>
                  <input
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    placeholder="2.5L I4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'transmissionOptional')}
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as Vehicle['transmission'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#0F766E]"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'plateNumber')}
                  </label>
                  <input
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="KSA 4821"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    {t(lang, 'mileageKm')}
                  </label>
                  <input
                    type="number"
                    value={mileageKm}
                    onChange={(e) => setMileageKm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm tabular-nums focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-[#64748B] cursor-pointer"
                >
                  {t(lang, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold cursor-pointer"
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
