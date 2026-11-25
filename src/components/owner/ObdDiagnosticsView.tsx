import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Bluetooth,
  BluetoothOff,
  Activity,
  AlertTriangle,
  Bot,
  RefreshCw,
  Info,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { sampleDtcCatalog } from '../../data/mockData';
import { ObdLiveData } from '../../types/platform';

export const ObdDiagnosticsView: React.FC = () => {
  const {
    lang,
    vehicles,
    activeVehicleId,
    obdConnected,
    setObdConnected,
    activeDtcs,
    setActiveDtcs,
    obdHistory,
    addObdScan,
    setObdAttachedToChat,
    setOwnerTab,
    showToast,
  } = usePlatform();

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];
  const [scanning, setScanning] = useState(false);
  const [liveData, setLiveData] = useState<ObdLiveData>({
    rpm: 780,
    speedKmh: 0,
    coolantTempC: 89,
    batteryVolts: 11.8,
    fuelTrimPct: 2.4,
    intakeTempC: 34,
  });

  // Subtle realistic telemetry simulation while connected
  useEffect(() => {
    if (!obdConnected) return;
    const timer = setInterval(() => {
      setLiveData((prev) => ({
        rpm: 760 + Math.floor(Math.random() * 65),
        speedKmh: prev.speedKmh,
        coolantTempC: 88 + Math.floor(Math.random() * 3),
        batteryVolts: Number((11.7 + Math.random() * 0.2).toFixed(1)),
        fuelTrimPct: Number((1.8 + Math.random() * 1.4).toFixed(1)),
        intakeTempC: 33 + Math.floor(Math.random() * 3),
      }));
    }, 1800);
    return () => clearInterval(timer);
  }, [obdConnected]);

  const handleToggleConnect = () => {
    const next = !obdConnected;
    setObdConnected(next);
    showToast(
      next
        ? lang === 'ar'
          ? 'تم الاتصال بمحاكاة جهاز OBD-II.'
          : 'Connected to simulated OBD-II adapter.'
        : lang === 'ar'
        ? 'تم قطع الاتصال بجهاز OBD-II.'
        : 'Disconnected simulated OBD-II adapter.'
    );
  };

  const handleScan = () => {
    if (!obdConnected) {
      setObdConnected(true);
    }
    setScanning(true);
    setTimeout(() => {
      const scannedCodes = [sampleDtcCatalog[0], sampleDtcCatalog[1]];
      setActiveDtcs(scannedCodes);
      addObdScan({
        vehicleLabel: activeVehicle
          ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
          : 'Vehicle',
        scannedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        dtcCount: scannedCodes.length,
        codes: scannedCodes.map((c) => c.code),
        batteryVolts: liveData.batteryVolts,
        coolantTempC: liveData.coolantTempC,
      });
      setScanning(false);
      showToast(
        lang === 'ar'
          ? 'اكتمل الفحص المحاكى — تم رصد رموز أعطال.'
          : 'Simulated ECU scan complete — DTC records updated.'
      );
    }, 1200);
  };

  const handleSendToAi = () => {
    setObdAttachedToChat(true);
    setOwnerTab('ai_chat');
  };

  const telemetryCards = [
    { label: t(lang, 'engineRpm'), value: obdConnected ? `${liveData.rpm}` : '--', unit: 'RPM' },
    { label: t(lang, 'vehicleSpeed'), value: obdConnected ? `${liveData.speedKmh}` : '--', unit: 'km/h' },
    { label: t(lang, 'coolantTemp'), value: obdConnected ? `${liveData.coolantTempC}` : '--', unit: '°C' },
    {
      label: t(lang, 'batteryVoltage'),
      value: obdConnected ? `${liveData.batteryVolts}` : '--',
      unit: 'V',
      warn: obdConnected && liveData.batteryVolts < 12.2,
    },
    { label: t(lang, 'fuelTrim'), value: obdConnected ? `+${liveData.fuelTrimPct}` : '--', unit: '%' },
    { label: t(lang, 'intakeTemp'), value: obdConnected ? `${liveData.intakeTempC}` : '--', unit: '°C' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#172B3A]">{t(lang, 'obdTitle')}</h1>
          {activeVehicle && (
            <p className="text-sm text-[#64748B]">
              {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ·{' '}
              {activeVehicle.plateNumber}
            </p>
          )}
        </div>
        <span className="text-xs font-medium text-[#0F766E] bg-[#DCEFEF] px-3 py-1.5 rounded-lg">
          {t(lang, 'sampleDataBadge')}
        </span>
      </div>

      {/* Explicit Hardware Simulation Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          {t(lang, 'obdHardwareNotice')}
        </p>
      </div>

      {/* Connection Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              obdConnected ? 'bg-[#DCEFEF] text-[#0F766E]' : 'bg-slate-100 text-[#64748B]'
            }`}
          >
            {obdConnected ? <Bluetooth className="w-6 h-6" /> : <BluetoothOff className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-xs text-[#64748B]">{t(lang, 'deviceStatusLabel')}</p>
            <p className="text-sm font-bold text-[#172B3A]">
              {obdConnected ? t(lang, 'statusConnected') : t(lang, 'statusDisconnected')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleConnect}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
              obdConnected
                ? 'border border-slate-200 text-[#172B3A] hover:bg-slate-50'
                : 'bg-[#172B3A] text-white hover:bg-[#1e384b]'
            }`}
          >
            {obdConnected ? t(lang, 'disconnectDevice') : t(lang, 'connectDevice')}
          </button>

          <button
            type="button"
            onClick={handleScan}
            disabled={scanning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? t(lang, 'scanningProgress') : t(lang, 'scanVehicle')}</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry Dashboard */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#0F766E]" />
          <h2 className="text-base font-bold text-[#172B3A]">{t(lang, 'liveTelemetryTitle')}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {telemetryCards.map((card, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border p-4 space-y-1.5 ${
                card.warn ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'
              }`}
            >
              <p className="text-xs text-[#64748B] truncate">{card.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-bold font-mono tabular-nums ${
                    card.warn ? 'text-amber-700' : 'text-[#172B3A]'
                  }`}
                >
                  {card.value}
                </span>
                <span className="text-xs font-mono text-[#64748B]">{card.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Diagnostic Trouble Codes + Integration CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#172B3A] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#0F766E]" />
              <span>{t(lang, 'dtcTitle')}</span>
            </h2>
            <button
              type="button"
              onClick={handleSendToAi}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{t(lang, 'analyzeDtcWithAi')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeDtcs.map((dtc) => (
              <div
                key={dtc.code}
                className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-[#172B3A] bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                      {dtc.code}
                    </span>
                    <span className="text-xs font-semibold text-[#0F766E]">
                      {bi(dtc.system, lang)}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      dtc.severity === 'high' ? 'text-rose-700' : 'text-amber-700'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {dtc.severity === 'high'
                      ? lang === 'ar'
                        ? 'حرج'
                        : 'High'
                      : lang === 'ar'
                      ? 'متوسط'
                      : 'Moderate'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#172B3A]">{bi(dtc.description, lang)}</p>
                <p className="text-xs text-[#64748B]">{bi(dtc.relatedSymptom, lang)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Scan History */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-[#172B3A]">{t(lang, 'recentScansTitle')}</h2>
          <div className="divide-y divide-slate-100">
            {obdHistory.map((scan) => (
              <div key={scan.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#172B3A] truncate">
                    {scan.vehicleLabel}
                  </p>
                  <p className="text-xs font-mono text-[#64748B] tabular-nums">
                    {scan.scannedAt} · {scan.batteryVolts}V · {scan.coolantTempC}°C
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#172B3A] shrink-0">
                  {scan.codes.length > 0 ? scan.codes.join(', ') : '0 DTC'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
