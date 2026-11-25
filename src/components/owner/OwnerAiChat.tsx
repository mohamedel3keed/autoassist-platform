import React, { useState } from 'react';
import {
  Bot,
  Car,
  Cpu,
  Image as ImageIcon,
  Mic,
  Send,
  RotateCcw,
  AlertCircle,
  FileText,
  Square,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { bi, t } from '../../i18n/translations';
import { ASSET_IMAGES } from '../../data/mockData';
import { DiagnosticMessage, DiagnosticReport } from '../../types/platform';

type FlowTrack = 'idle' | 'stalled' | 'overheat' | 'brakes';

export const OwnerAiChat: React.FC = () => {
  const {
    lang,
    vehicles,
    activeVehicleId,
    setActiveVehicleId,
    obdAttachedToChat,
    setObdAttachedToChat,
    activeDtcs,
    createReport,
    setOwnerTab,
    showToast,
  } = usePlatform();

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];
  const vehicleLabel = activeVehicle
    ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
    : '2022 Toyota Camry Hybrid';

  const makeInitialGreeting = (): DiagnosticMessage => ({
    id: 'msg-welcome',
    sender: 'ai',
    text:
      lang === 'ar'
        ? `مرحباً! أنا مساعد التشخيص الذكي لسيارتك ${vehicleLabel}. صف المشكلة التي تواجهها، أو اختر أحد الأعراض الشائعة أدناه وسأطرح عليك أسئلة متابعة لتحديد الأسباب المحتملة.`
        : `Hello! I'm your AI Diagnostic Assistant for your ${vehicleLabel}. Describe what you're experiencing, or pick a sample symptom below—I'll ask a few targeted questions before preparing a report.`,
    timestamp: 'Just now',
  });

  const [messages, setMessages] = useState<DiagnosticMessage[]>([makeInitialGreeting()]);
  const [inputText, setInputText] = useState('');
  const [flowTrack, setFlowTrack] = useState<FlowTrack>('idle');
  const [flowStep, setFlowStep] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<{
    type: 'image' | 'audio';
    label: string;
    previewUrl?: string;
  } | null>(null);
  const [latestGeneratedReportId, setLatestGeneratedReportId] = useState<string | null>(null);

  const resetConversation = () => {
    setMessages([makeInitialGreeting()]);
    setFlowTrack('idle');
    setFlowStep(0);
    setLatestGeneratedReportId(null);
    setPendingAttachment(null);
  };

  const buildReportForTrack = (track: FlowTrack, extraAnswer: string): Omit<DiagnosticReport, 'id'> => {
    const dtcList = obdAttachedToChat ? activeDtcs.map((d) => d.code) : undefined;

    if (track === 'overheat') {
      return {
        vehicleId: activeVehicle?.id || 'veh-1',
        vehicleLabel,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        summary: {
          en: `Rising coolant temperature in traffic (${extraAnswer}) suggests impaired heat dissipation from the cooling fan, thermostat, or coolant circulation circuit.`,
          ar: `ارتفاع حرارة المحرك أثناء التوقف (${extraAnswer}) يشير غالباً إلى ضعف في تبريد الرديتر أو الثيرموستات أو مروحة التبريد.`,
        },
        reportedSymptoms: [
          { en: 'Engine temperature gauge climbing above normal', ar: 'ارتفاع مؤشر حرارة المحرك فوق المعدل الطبيعي' },
          { en: `Observed condition: ${extraAnswer}`, ar: `الملاحظة المبلّغة: ${extraAnswer}` },
        ],
        riskLevel: 'high',
        safetyNotice: {
          en: 'Stop driving immediately if the temperature gauge enters the red zone or steam is visible. Continued driving can cause severe cylinder head damage.',
          ar: 'توقف عن القيادة فوراً إذا وصل المؤشر للمنطقة الحمراء أو ظهر بخار، لأن الاستمرار قد يسبب تلف رأس المحرك.',
        },
        causes: [
          {
            id: 'ov-1',
            title: { en: 'Radiator Cooling Fan or Fan Relay Fault', ar: 'تعطل مروحة الرديتر أو مرحل المروحة' },
            likelihood: 'high',
            explanation: {
              en: 'Overheating primarily while idling or in slow traffic is the classic signature of insufficient airflow across the radiator.',
              ar: 'ارتفاع الحرارة أثناء الوقوف أو الازدحام يدل غالباً على ضعف تدفق الهواء عبر الرديتر بسبب المروحة.',
            },
            estimatedInspection: { en: 'Fan motor & relay activation test', ar: 'فحص محرك المروحة والمرحل' },
          },
          {
            id: 'ov-2',
            title: { en: 'Stuck Closed Thermostat or Low Coolant Level', ar: 'تعليق الثيرموستات أو نقص سائل التبريد' },
            likelihood: 'medium',
            explanation: {
              en: 'A thermostat stuck partially closed restricts hot coolant from reaching the radiator.',
              ar: 'تعليق الثيرموستات يمنع دوران سائل التبريد بشكل كامل إلى الرديتر.',
            },
            estimatedInspection: { en: 'Pressure leak test & upper hose thermal check', ar: 'اختبار ضغط التبريد وفحص حرارة الخراطيم' },
          },
          {
            id: 'ov-3',
            title: { en: 'Water Pump Impeller Wear', ar: 'ضعف طرمبة الماء' },
            likelihood: 'low',
            explanation: {
              en: 'Reduced coolant flow velocity at low RPM can gradually push temperatures upward.',
              ar: 'ضعف ضخ سائل التبريد عند السرعات المنخفضة يرفع الحرارة تدريجياً.',
            },
            estimatedInspection: { en: 'Coolant flow & water pump inspection', ar: 'فحص تدفق سائل التبريد وطرمبة الماء' },
          },
        ],
        recommendedInspection: {
          en: 'Pressure-test the cooling system when cold and verify dual cooling fan operation at operating temperature.',
          ar: 'اختبار ضغط دائرة التبريد وهي باردة والتحقق من عمل مراوح التبريد عند درجة التشغيل.',
        },
        recommendedCategory: 'service_center',
        recommendedServiceTag: 'Cooling System',
        linkedDtcCodes: dtcList,
        saved: false,
      };
    }

    if (track === 'brakes') {
      return {
        vehicleId: activeVehicle?.id || 'veh-1',
        vehicleLabel,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        summary: {
          en: `Audible brake squealing combined with pedal or steering feedback (${extraAnswer}) points to worn friction pads or uneven brake rotor surfaces.`,
          ar: `صوت صفير المكابح مع الاهتزاز (${extraAnswer}) يشير عادةً إلى تآكل الفحمات أو عدم استواء سطح الهوبات.`,
        },
        reportedSymptoms: [
          { en: 'High-pitched squeal during braking', ar: 'صوت صفير عند الضغط على المكابح' },
          { en: `Braking response detail: ${extraAnswer}`, ar: `تفاصيل الاستجابة: ${extraAnswer}` },
        ],
        riskLevel: 'moderate',
        safetyNotice: {
          en: 'Avoid high-speed driving and maintain extra following distance until brake pad thickness is physically inspected.',
          ar: 'تجنب السرعات العالية وحافظ على مسافة أمان إضافية حتى يتم فحص سماكة الفحمات.',
        },
        causes: [
          {
            id: 'br-1',
            title: { en: 'Worn Brake Pads Reaching Wear Indicator', ar: 'تآكل فحمات المكابح ووصولها لمؤشر التنبيه' },
            likelihood: 'high',
            explanation: {
              en: 'Built-in metallic wear tabs emit a deliberate squeal when pad thickness falls below ~3mm.',
              ar: 'تصدر شرائح التنبيه المعدنية صوت صفير عند انخفاض سماكة الفحمات لأقل من 3 ملم.',
            },
            estimatedInspection: { en: 'Visual wheel-off pad thickness measurement', ar: 'قياس سماكة الفحمات بعد فك الإطار' },
          },
          {
            id: 'br-2',
            title: { en: 'Warped or Scored Brake Rotors', ar: 'تعرّج أو خدش في هوبات المكابح' },
            likelihood: 'medium',
            explanation: {
              en: 'Thermal distortion of the rotor disc causes rhythmic pulsing through the brake pedal.',
              ar: 'تشوه سطح الهوب بالحرارة يسبب اهتزازاً متكرراً في دواسة الفرامل.',
            },
            estimatedInspection: { en: 'Rotor runout dial-indicator check', ar: 'فحص استقامة الهوب بالمقياس الدقيق' },
          },
          {
            id: 'br-3',
            title: { en: 'Dry or Sticking Caliper Guide Pins', ar: 'جفاف أو تعليق مسامير الكاليبر' },
            likelihood: 'low',
            explanation: {
              en: 'Uneven caliper retraction creates drag and uneven inner/outer pad wear.',
              ar: 'عدم رجوع الكاليبر بسلاسة يسبب احتكاكاً وتآكلاً غير متساوٍ.',
            },
            estimatedInspection: { en: 'Caliper slide pin cleaning & lubrication', ar: 'تنظيف وتشحيم مسامير الكاليبر' },
          },
        ],
        recommendedInspection: {
          en: 'Inspect front and rear brake pad thickness, rotor runout, and brake fluid moisture level.',
          ar: 'فحص سماكة الفحمات الأمامية والخلفية واستقامة الهوبات وجودة زيت المكابح.',
        },
        recommendedCategory: 'workshop',
        recommendedServiceTag: 'Brake Service',
        linkedDtcCodes: dtcList,
        saved: false,
      };
    }

    // Default / Stalled while driving example flow
    return {
      vehicleId: activeVehicle?.id || 'veh-1',
      vehicleLabel,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      summary: {
        en: `Sudden engine stall while driving followed by no-start and "${extraAnswer}" strongly indicates an electrical charging/supply interruption or fuel delivery loss.`,
        ar: `التوقف المفاجئ أثناء القيادة مع عدم التشغيل و(${extraAnswer}) يشير بقوة إلى انقطاع في دائرة الشحن والكهرباء أو منظومة ضخ الوقود.`,
      },
      reportedSymptoms: [
        { en: 'Vehicle stopped suddenly while driving', ar: 'توقف السيارة فجأة أثناء القيادة' },
        { en: 'Engine fails to restart', ar: 'عدم استجابة المحرك عند إعادة التشغيل' },
        { en: `Ignition & dash response: ${extraAnswer}`, ar: `حالة الإشعال والطبلون: ${extraAnswer}` },
      ],
      riskLevel: 'high',
      safetyNotice: {
        en: 'Do not attempt to force-start or drive the vehicle if stalling occurred on the road. Move to safety and request a workshop inspection or tow.',
        ar: 'لا تحاول قيادة السيارة عند تكرار التوقف المفاجئ. توقف في مكان آمن واطلب فحصاً فنياً أو سحب المركبة.',
      },
      causes: [
        {
          id: 'st-1',
          title: { en: 'Alternator / Charging Circuit Failure', ar: 'تعطل الدينامو أو دائرة الشحن' },
          likelihood: 'high',
          explanation: {
            en: 'When the alternator stops charging, battery voltage drops rapidly until ignition coils and fuel injectors lose power mid-drive.',
            ar: 'عند توقف الدينامو عن الشحن، ينخفض جهد البطارية سريعاً حتى تنطفئ منظومة الإشعال والحقن أثناء السير.',
          },
          estimatedInspection: { en: 'Alternator voltage & 12V load test', ar: 'فحص جهد الدينامو وحمل البطارية' },
        },
        {
          id: 'st-2',
          title: { en: '12V Battery Terminal Loose / Deep Discharge', ar: 'ارتخاء أقطاب البطارية أو تفريغها' },
          likelihood: 'medium',
          explanation: {
            en: 'Corroded clamps or weak cells cause dim/absent dashboard lights and prevent starter engagement.',
            ar: 'تأكسد الأقطاب أو ضعف خلايا البطارية يؤدي لضعف إضاءة الطبلون وعدم دوران السلف.',
          },
          estimatedInspection: { en: 'Battery CCA & ground strap resistance check', ar: 'فحص قدرة البطارية وأسلاك التأريض' },
        },
        {
          id: 'st-3',
          title: { en: 'Fuel Pump Relay or Crankshaft Sensor Fault', ar: 'خلل في مرحل مضخة الوقود أو حساس الكرنك' },
          likelihood: 'low',
          explanation: {
            en: 'If dashboard lights remain bright, a failed fuel relay or crankshaft position sensor can cut spark/fuel suddenly.',
            ar: 'إذا كانت إضاءة الطبلون قوية، فقد يتسبب مرحل الوقود أو حساس الكرنك في قطع التشغيل فجأة.',
          },
          estimatedInspection: { en: 'Fuel pressure & ECU cranking signal scan', ar: 'قياس ضغط الوقود وفحص إشارة الكرنك' },
        },
      ],
      recommendedInspection: {
        en: 'Test 12V battery voltage, alternator output, and scan ECU fault codes before replacing components.',
        ar: 'فحص جهد بطارية 12 فولت ومخرجات الدينامو وقراءة أكواد الكمبيوتر قبل استبدال أي قطعة.',
      },
      recommendedCategory: 'workshop',
      recommendedServiceTag: 'Electrical Diagnostics',
      linkedDtcCodes: dtcList || ['P0562'],
      saved: false,
    };
  };

  const processUserMessage = (text: string, attachment?: DiagnosticMessage['attachment']) => {
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;

    const userMsg: DiagnosticMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed || (attachment ? attachment.label : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment,
    };

    const lower = trimmed.toLowerCase();
    let nextTrack = flowTrack;
    let nextStep = flowStep;

    if (flowTrack === 'idle') {
      if (lower.includes('heat') || lower.includes('temp') || lower.includes('حرارة') || lower.includes('تبريد')) {
        nextTrack = 'overheat';
      } else if (lower.includes('brake') || lower.includes('squeak') || lower.includes('مكابح') || lower.includes('فرامل') || lower.includes('صفير')) {
        nextTrack = 'brakes';
      } else {
        nextTrack = 'stalled';
      }
      nextStep = 1;
    } else {
      nextStep = flowStep + 1;
    }

    setFlowTrack(nextTrack);
    setFlowStep(nextStep);
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setPendingAttachment(null);

    // Generate AI follow-up or final report
    setTimeout(() => {
      if (nextStep === 1) {
        let aiReply: DiagnosticMessage;
        if (nextTrack === 'overheat') {
          aiReply = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text:
              lang === 'ar'
                ? 'هل تلاحظ ارتفاع الحرارة أثناء الوقوف والازدحام أكثر أم على السرعات العالية؟ وهل تعمل مروحة التبريد؟'
                : 'Does the temperature climb mostly while idling in traffic or at highway speeds, and do you hear the radiator cooling fan running?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedOptions: [
              { id: 'o1', label: { en: 'Mostly in traffic / fan is silent', ar: 'في الزحام والمروحة صامتة' } },
              { id: 'o2', label: { en: 'Both idle and highway', ar: 'في الزحام والطريق السريع' } },
              { id: 'o3', label: { en: 'Low coolant warning appeared', ar: 'ظهر تنبيه نقص سائل التبريد' } },
            ],
          };
        } else if (nextTrack === 'brakes') {
          aiReply = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text:
              lang === 'ar'
                ? 'هل تشعر باهتزاز في المقود أو دواسة الفرامل عند التهدئة من سرعة متوسطة؟'
                : 'Do you also feel a pulsation in the brake pedal or vibration in the steering wheel when slowing down?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedOptions: [
              { id: 'b1', label: { en: 'Yes, pedal pulsates', ar: 'نعم، يوجد اهتزاز بالدواسة' } },
              { id: 'b2', label: { en: 'Only squealing noise', ar: 'فقط صوت صفير بدون اهتزاز' } },
              { id: 'b3', label: { en: 'Grinding metallic feel', ar: 'صوت احتكاك معدني خشن' } },
            ],
          };
        } else {
          // Exact prompt example!
          aiReply = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text:
              lang === 'ar'
                ? 'هل تضيء لمبات لوحة العدادات (الطبلون) عند تدوير مفتاح التشغيل؟'
                : 'Do the dashboard lights turn on when you switch on the ignition?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedOptions: [
              { id: 's1', label: { en: 'Yes', ar: 'نعم' } },
              { id: 's2', label: { en: 'No', ar: 'لا' } },
              { id: 's3', label: { en: 'They are weak', ar: 'إنها ضعيفة' } },
            ],
          };
        }
        setMessages((prev) => [...prev, aiReply]);
      } else if (nextStep === 2) {
        const secondQuestion: DiagnosticMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text:
            nextTrack === 'stalled'
              ? lang === 'ar'
                ? 'شكراً للتوضيح. هل سمعت صوت طقطقة عند محاولة التشغيل أو لاحظت إضاءة لمبة البطارية قبل التوقف؟'
                : 'Thank you. Did you hear rapid clicking when trying to crank, or notice a battery/charging warning light just before it stopped?'
              : lang === 'ar'
              ? 'مفهوم. منذ متى بدأت هذه المشكلة وهل أجريت صيانة قريبة لهذا النظام؟'
              : 'Understood. When did this symptom first appear, and has the vehicle had recent service on this system?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedOptions:
            nextTrack === 'stalled'
              ? [
                  { id: 'q1', label: { en: 'Rapid clicking & battery icon', ar: 'صوت طقطقة ولمبة البطارية' } },
                  { id: 'q2', label: { en: 'Cranks normally but won’t fire', ar: 'يدور المحرك لكن لا يشتغل' } },
                  { id: 'q3', label: { en: 'Completely silent', ar: 'صمت تام بدون استجابة' } },
                ]
              : [
                  { id: 'q4', label: { en: 'Started this week', ar: 'بدأت هذا الأسبوع' } },
                  { id: 'q5', label: { en: 'Gradually over a month', ar: 'تدريجياً خلال شهر' } },
                ],
        };
        setMessages((prev) => [...prev, secondQuestion]);
      } else {
        // Generate Report!
        const newReport = createReport(buildReportForTrack(nextTrack, trimmed));
        setLatestGeneratedReportId(newReport.id);
        const finalMsg: DiagnosticMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text:
            lang === 'ar'
              ? 'بناءً على الأعراض وبيانات سيارتك، قمت بإعداد تقرير التقييم التشخيصي بالأسباب المحتملة ومستوى الخطورة. يمكنك استعراض التقرير الكامل الآن.'
              : 'Based on your responses and vehicle profile, I have prepared a diagnostic assessment report with ranked possible causes and recommended inspection steps.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          linkedReportId: newReport.id,
        };
        setMessages((prev) => [...prev, finalMsg]);
      }
    }, 350);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPendingAttachment({
          type: 'image',
          label: file.name,
          previewUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAudioToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setPendingAttachment({
        type: 'audio',
        label: lang === 'ar' ? 'تسجيل صوتي لصوت المحرك (0:08 - محاكاة)' : 'Engine sound memo (0:08 — simulated)',
      });
      showToast(lang === 'ar' ? 'تم إرفاق التسجيل الصوتي المحاكى.' : 'Simulated voice note attached.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header + Vehicle Context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#172B3A]">{t(lang, 'aiAssistantTitle')}</h1>
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Car className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{t(lang, 'activeVehicleContext')}:</span>
              <select
                value={activeVehicleId}
                onChange={(e) => setActiveVehicleId(e.target.value)}
                className="font-semibold text-[#172B3A] bg-transparent focus:outline-none cursor-pointer"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setObdAttachedToChat(!obdAttachedToChat)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              obdAttachedToChat
                ? 'bg-[#DCEFEF] border-[#0F766E]/30 text-[#0F766E]'
                : 'bg-white border-slate-200 text-[#64748B] hover:text-[#172B3A]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {obdAttachedToChat
                ? `${t(lang, 'obdAttached')} (${activeDtcs.map((d) => d.code).join(', ')})`
                : t(lang, 'attachObdContext')}
            </span>
          </button>

          <button
            type="button"
            onClick={resetConversation}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-[#172B3A] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(lang, 'resetChatBtn')}</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Disclaimer */}
      <div className="bg-[#DCEFEF]/60 border border-[#0F766E]/20 rounded-xl px-4 py-2.5 flex items-start gap-2.5 text-xs text-[#172B3A]">
        <AlertCircle className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t(lang, 'aiDisclaimer')}</p>
      </div>

      {/* Chat Conversation Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col min-h-[460px] max-h-[62vh]">
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-[#F8FAFC] border border-slate-200 text-[#172B3A]'
                }`}
              >
                {msg.attachment && (
                  <div className="mb-2">
                    {msg.attachment.type === 'image' && msg.attachment.previewUrl ? (
                      <img
                        src={msg.attachment.previewUrl}
                        alt={msg.attachment.label}
                        className="w-48 h-32 object-cover rounded-xl border border-white/20 mb-1"
                      />
                    ) : (
                      <div className="px-3 py-2 rounded-lg bg-white/15 text-xs font-medium flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5" />
                        <span>{msg.attachment.label}</span>
                      </div>
                    )}
                  </div>
                )}
                <p>{msg.text}</p>

                {msg.linkedReportId && (
                  <button
                    type="button"
                    onClick={() => setOwnerTab('diagnostic_report')}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t(lang, 'viewFullReportBtn')}</span>
                  </button>
                )}
              </div>

              {/* Suggested Reply Buttons */}
              {msg.suggestedOptions && !latestGeneratedReportId && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {msg.suggestedOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => processUserMessage(bi(opt.label, lang))}
                      className="px-3.5 py-2 rounded-xl border border-[#0F766E]/30 bg-white hover:bg-[#DCEFEF] text-[#0F766E] text-xs font-semibold transition-colors cursor-pointer min-h-[38px]"
                    >
                      {bi(opt.label, lang)}
                    </button>
                  ))}
                </div>
              )}
              <span className="text-[11px] text-[#64748B] mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Sample Scenario Prompts when Idle */}
        {flowTrack === 'idle' && (
          <div className="px-4 py-2.5 border-t border-slate-100 bg-[#F8FAFC] flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#64748B]">
              {t(lang, 'quickScenariosLabel')}
            </span>
            <button
              type="button"
              onClick={() =>
                processUserMessage(
                  lang === 'ar'
                    ? 'توقفت سيارتي فجأة أثناء القيادة والآن لا تعمل.'
                    : "My car suddenly stopped while driving and now it won't start."
                )
              }
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F766E] text-xs font-medium text-[#172B3A] cursor-pointer"
            >
              {t(lang, 'scenarioStalled')}
            </button>
            <button
              type="button"
              onClick={() =>
                processUserMessage(
                  lang === 'ar'
                    ? 'مؤشر حرارة المحرك يرتفع أثناء التوقف.'
                    : 'Engine coolant temperature keeps rising in traffic.'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F766E] text-xs font-medium text-[#172B3A] cursor-pointer"
            >
              {t(lang, 'scenarioOverheat')}
            </button>
            <button
              type="button"
              onClick={() =>
                processUserMessage(
                  lang === 'ar'
                    ? 'أسمع صوت صفير واهتزاز عند الضغط على المكابح.'
                    : 'Brakes are squeaking and vibrating when slowing down.'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F766E] text-xs font-medium text-[#172B3A] cursor-pointer"
            >
              {t(lang, 'scenarioBrakes')}
            </button>
          </div>
        )}

        {/* Pending Attachment Bar */}
        {pendingAttachment && (
          <div className="px-4 py-2 bg-[#DCEFEF]/50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="font-medium text-[#0F766E] truncate">
              {pendingAttachment.label}
            </span>
            <button
              type="button"
              onClick={() => setPendingAttachment(null)}
              className="text-rose-600 font-semibold cursor-pointer"
            >
              {t(lang, 'delete')}
            </button>
          </div>
        )}

        {/* Composer Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            processUserMessage(inputText, pendingAttachment || undefined);
          }}
          className="p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2"
        >
          <label
            title={t(lang, 'uploadImageBtn')}
            className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-[#64748B] hover:text-[#0F766E] cursor-pointer shrink-0"
          >
            <ImageIcon className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          <button
            type="button"
            onClick={() =>
              setPendingAttachment({
                type: 'image',
                label: lang === 'ar' ? 'صورة لوحة العدادات (عينة)' : 'Dashboard warning photo (sample)',
                previewUrl: ASSET_IMAGES.sedan,
              })
            }
            className="hidden sm:inline-flex px-2.5 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 items-center text-xs font-medium text-[#64748B] cursor-pointer shrink-0"
          >
            {t(lang, 'samplePhotoBtn')}
          </button>

          <button
            type="button"
            onClick={handleAudioToggle}
            title={t(lang, 'recordAudioBtn')}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
              isRecording
                ? 'bg-rose-600 border-rose-600 text-white'
                : 'border-slate-200 hover:bg-slate-50 text-[#64748B] hover:text-[#0F766E]'
            }`}
          >
            {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRecording ? t(lang, 'recordingActive') : t(lang, 'typeSymptomPlaceholder')}
            className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E]"
          />

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] text-white text-sm font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t(lang, 'sendBtn')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
