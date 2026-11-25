import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AdminSection,
  BookingRequest,
  BookingStatus,
  DiagnosticFeedbackRecord,
  DiagnosticReport,
  DtcCode,
  Language,
  ObdScanRecord,
  OrderStatus,
  OwnerTab,
  PlatformNotification,
  PlatformUser,
  Provider,
  ProviderSection,
  ProviderService,
  ProviderType,
  SparePartOrder,
  SparePartProduct,
  UserReportItem,
  UserRole,
  Vehicle,
} from '../types/platform';
import {
  initialBookings,
  initialDiagnosticReports,
  initialFeedbackRecords,
  initialNotifications,
  initialObdHistory,
  initialProviders,
  initialSparePartOrders,
  initialSpareParts,
  initialUserReports,
  initialUsers,
  initialVehicles,
  sampleDtcCatalog,
} from '../data/mockData';

interface ExplorePresetFilter {
  serviceType?: ProviderType | 'all';
  brand?: string;
  query?: string;
}

interface PlatformContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;

  role: UserRole;
  setRole: (role: UserRole) => void;

  // Onboarding Modal
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  ownerName: string;
  setOwnerName: (name: string) => void;
  ownerEmail: string;
  setOwnerEmail: (email: string) => void;
  ownerPhone: string;
  setOwnerPhone: (phone: string) => void;
  ownerAvatar: string | null;
  setOwnerAvatar: (url: string | null) => void;
  ownerLocation: 'riyadh' | 'jeddah' | 'dammam';
  setOwnerLocation: (loc: 'riyadh' | 'jeddah' | 'dammam') => void;

  // Owner App Navigation & State
  ownerTab: OwnerTab;
  setOwnerTab: (tab: OwnerTab) => void;
  vehicles: Vehicle[];
  activeVehicleId: string;
  setActiveVehicleId: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;

  // Diagnostic Reports & Chat Context
  reports: DiagnosticReport[];
  activeReportId: string;
  setActiveReportId: (id: string) => void;
  createReport: (report: Omit<DiagnosticReport, 'id'>) => DiagnosticReport;
  saveReport: (id: string) => void;

  // OBD-II State
  obdConnected: boolean;
  setObdConnected: (connected: boolean) => void;
  obdAttachedToChat: boolean;
  setObdAttachedToChat: (attached: boolean) => void;
  activeDtcs: DtcCode[];
  setActiveDtcs: (codes: DtcCode[]) => void;
  obdHistory: ObdScanRecord[];
  addObdScan: (record: Omit<ObdScanRecord, 'id'>) => void;

  // Explore & Providers
  providers: Provider[];
  selectedProviderId: string;
  setSelectedProviderId: (id: string) => void;
  explorePreset: ExplorePresetFilter;
  setExplorePreset: (preset: ExplorePresetFilter) => void;
  openExploreWithFilter: (preset: ExplorePresetFilter) => void;
  openProviderProfile: (providerId: string) => void;

  // Bookings
  bookings: BookingRequest[];
  createBooking: (booking: Omit<BookingRequest, 'id' | 'status'>) => BookingRequest;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;

  // Provider Dashboard State
  providerDemoType: ProviderType;
  setProviderDemoType: (type: ProviderType) => void;
  providerSection: ProviderSection;
  setProviderSection: (section: ProviderSection) => void;
  updateProviderProfile: (providerId: string, partial: Partial<Provider>) => void;
  addProviderService: (providerId: string, service: Omit<ProviderService, 'id'>) => void;
  updateProviderService: (providerId: string, service: ProviderService) => void;
  deleteProviderService: (providerId: string, serviceId: string) => void;

  // Diagnostic Feedback Knowledge Base
  feedbackRecords: DiagnosticFeedbackRecord[];
  addFeedbackRecord: (record: Omit<DiagnosticFeedbackRecord, 'id' | 'submittedAt'>) => void;
  markFeedbackReviewed: (id: string) => void;

  // Spare Parts Shop
  spareParts: SparePartProduct[];
  addSparePart: (part: Omit<SparePartProduct, 'id' | 'status'>) => void;
  updateSparePart: (part: SparePartProduct) => void;
  deleteSparePart: (id: string) => void;
  sparePartOrders: SparePartOrder[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Admin State
  adminSection: AdminSection;
  setAdminSection: (section: AdminSection) => void;
  users: PlatformUser[];
  toggleUserActive: (userId: string) => void;
  verifyProvider: (providerId: string, status: 'verified' | 'rejected') => void;
  userReports: UserReportItem[];
  updateUserReportStatus: (id: string, status: 'resolved' | 'dismissed') => void;
  moderateReview: (providerId: string, reviewId: string, status: 'approved' | 'hidden') => void;
  serviceCatalog: { id: string; en: string; ar: string; active: boolean }[];
  addServiceCategory: (en: string, ar: string) => void;
  toggleServiceCategory: (id: string) => void;
  brandCatalog: { id: string; make: string; models: string[] }[];
  addBrandModel: (make: string, model: string) => void;

  // Notifications & Toast
  notifications: PlatformNotification[];
  markAllNotificationsRead: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('car_owner');
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [ownerName, setOwnerName] = useState('Abdullah Al-Saud');
  const [ownerEmail, setOwnerEmail] = useState('abdullah.s@motormate.demo');
  const [ownerPhone, setOwnerPhone] = useState('+966 55 310 7788');
  const [ownerAvatar, setOwnerAvatar] = useState<string | null>(null);
  const [ownerLocation, setOwnerLocation] = useState<'riyadh' | 'jeddah' | 'dammam'>('riyadh');

  const [ownerTab, setOwnerTab] = useState<OwnerTab>('home');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [activeVehicleId, setActiveVehicleId] = useState<string>(initialVehicles[0].id);

  const [reports, setReports] = useState<DiagnosticReport[]>(initialDiagnosticReports);
  const [activeReportId, setActiveReportId] = useState<string>(initialDiagnosticReports[0].id);

  const [obdConnected, setObdConnected] = useState<boolean>(false);
  const [obdAttachedToChat, setObdAttachedToChat] = useState<boolean>(false);
  const [activeDtcs, setActiveDtcs] = useState<DtcCode[]>([sampleDtcCatalog[0]]);
  const [obdHistory, setObdHistory] = useState<ObdScanRecord[]>(initialObdHistory);

  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [selectedProviderId, setSelectedProviderId] = useState<string>(initialProviders[0].id);
  const [explorePreset, setExplorePreset] = useState<ExplorePresetFilter>({ serviceType: 'all' });

  const [bookings, setBookings] = useState<BookingRequest[]>(initialBookings);

  const [providerDemoType, setProviderDemoType] = useState<ProviderType>('workshop');
  const [providerSection, setProviderSection] = useState<ProviderSection>('overview');

  const [feedbackRecords, setFeedbackRecords] = useState<DiagnosticFeedbackRecord[]>(initialFeedbackRecords);
  const [spareParts, setSpareParts] = useState<SparePartProduct[]>(initialSpareParts);
  const [sparePartOrders, setSparePartOrders] = useState<SparePartOrder[]>(initialSparePartOrders);

  const [adminSection, setAdminSection] = useState<AdminSection>('overview');
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [userReports, setUserReports] = useState<UserReportItem[]>(initialUserReports);

  const [serviceCatalog, setServiceCatalog] = useState([
    { id: 'cat-1', en: 'Electrical Diagnostics', ar: 'تشخيص الكهرباء', active: true },
    { id: 'cat-2', en: 'Engine & Powertrain', ar: 'المحرك ونقل الحركة', active: true },
    { id: 'cat-3', en: 'Hybrid & EV Systems', ar: 'أنظمة الهايبرد والكهربائية', active: true },
    { id: 'cat-4', en: 'Brake & Suspension', ar: 'المكابح ونظام التعليق', active: true },
    { id: 'cat-5', en: 'Cooling & AC', ar: 'التبريد والتكييف', active: true },
  ]);

  const [brandCatalog, setBrandCatalog] = useState([
    { id: 'br-1', make: 'Toyota', models: ['Camry', 'Camry Hybrid', 'Corolla', 'RAV4', 'Land Cruiser'] },
    { id: 'br-2', make: 'Hyundai', models: ['Tucson', 'Elantra', 'Sonata', 'Santa Fe'] },
    { id: 'br-3', make: 'Honda', models: ['Accord', 'Civic', 'CR-V'] },
    { id: 'br-4', make: 'Lexus', models: ['ES300h', 'RX350', 'IS300'] },
  ]);

  const [notifications, setNotifications] = useState<PlatformNotification[]>(initialNotifications);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ar' : 'en'));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3400);
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>): Vehicle => {
    const newVeh: Vehicle = { ...vehicleData, id: `veh-${Date.now()}` };
    setVehicles((prev) => [newVeh, ...prev]);
    setActiveVehicleId(newVeh.id);
    return newVeh;
  };

  const updateVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? vehicle : v)));
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => {
      const next = prev.filter((v) => v.id !== id);
      if (activeVehicleId === id && next.length > 0) {
        setActiveVehicleId(next[0].id);
      }
      return next;
    });
  };

  const createReport = (reportData: Omit<DiagnosticReport, 'id'>): DiagnosticReport => {
    const rep: DiagnosticReport = { ...reportData, id: `rep-${Date.now()}` };
    setReports((prev) => [rep, ...prev]);
    setActiveReportId(rep.id);
    return rep;
  };

  const saveReport = (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, saved: true } : r)));
  };

  const addObdScan = (record: Omit<ObdScanRecord, 'id'>) => {
    setObdHistory((prev) => [{ ...record, id: `scan-${Date.now()}` }, ...prev]);
  };

  const openExploreWithFilter = (preset: ExplorePresetFilter) => {
    setExplorePreset(preset);
    setOwnerTab('explore');
  };

  const openProviderProfile = (providerId: string) => {
    setSelectedProviderId(providerId);
    setOwnerTab('provider_profile');
  };

  const createBooking = (data: Omit<BookingRequest, 'id' | 'status'>): BookingRequest => {
    const newBooking: BookingRequest = {
      ...data,
      id: `bk-${Math.floor(300 + Math.random() * 699)}`,
      status: 'pending',
    };
    setBookings((prev) => [newBooking, ...prev]);
    setNotifications((prev) => [
      {
        id: `not-${Date.now()}`,
        title: { en: 'New Service Booking Submitted', ar: 'تم إرسال طلب حجز جديد' },
        body: {
          en: `Request sent to ${data.providerName.en} for ${data.vehicleSummary}.`,
          ar: `تم إرسال الطلب إلى ${data.providerName.ar} لسيارة ${data.vehicleSummary}.`,
        },
        time: { en: 'Just now', ar: 'الآن' },
        read: false,
        targetTab: 'history',
      },
      ...prev,
    ]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
  };

  const updateProviderProfile = (providerId: string, partial: Partial<Provider>) => {
    setProviders((prev) => prev.map((p) => (p.id === providerId ? { ...p, ...partial } : p)));
  };

  const addProviderService = (providerId: string, service: Omit<ProviderService, 'id'>) => {
    const newSrv: ProviderService = { ...service, id: `srv-${Date.now()}` };
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, services: [...p.services, newSrv] } : p))
    );
  };

  const updateProviderService = (providerId: string, service: ProviderService) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, services: p.services.map((s) => (s.id === service.id ? service : s)) }
          : p
      )
    );
  };

  const deleteProviderService = (providerId: string, serviceId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, services: p.services.filter((s) => s.id !== serviceId) }
          : p
      )
    );
  };

  const addFeedbackRecord = (record: Omit<DiagnosticFeedbackRecord, 'id' | 'submittedAt'>) => {
    const newRec: DiagnosticFeedbackRecord = {
      ...record,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    setFeedbackRecords((prev) => [newRec, ...prev]);
    setBookings((prev) =>
      prev.map((b) => (b.id === record.bookingId ? { ...b, feedbackSubmitted: true, status: 'completed' } : b))
    );
  };

  const markFeedbackReviewed = (id: string) => {
    setFeedbackRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reviewStatus: 'verified' } : r))
    );
  };

  const computeStockStatus = (qty: number): SparePartProduct['status'] => {
    if (qty <= 0) return 'out_of_stock';
    if (qty <= 5) return 'low_stock';
    return 'in_stock';
  };

  const addSparePart = (part: Omit<SparePartProduct, 'id' | 'status'>) => {
    setSpareParts((prev) => [
      { ...part, id: `prt-${Date.now()}`, status: computeStockStatus(part.quantity) },
      ...prev,
    ]);
  };

  const updateSparePart = (part: SparePartProduct) => {
    setSpareParts((prev) =>
      prev.map((p) => (p.id === part.id ? { ...part, status: computeStockStatus(part.quantity) } : p))
    );
  };

  const deleteSparePart = (id: string) => {
    setSpareParts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setSparePartOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const toggleUserActive = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)));
  };

  const verifyProvider = (providerId: string, status: 'verified' | 'rejected') => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? {
              ...p,
              verified: status === 'verified',
              verificationStatus: status,
            }
          : p
      )
    );
  };

  const updateUserReportStatus = (id: string, status: 'resolved' | 'dismissed') => {
    setUserReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const moderateReview = (providerId: string, reviewId: string, status: 'approved' | 'hidden') => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? {
              ...p,
              reviews: p.reviews.map((rev) => (rev.id === reviewId ? { ...rev, status } : rev)),
            }
          : p
      )
    );
  };

  const addServiceCategory = (en: string, ar: string) => {
    setServiceCatalog((prev) => [...prev, { id: `cat-${Date.now()}`, en, ar, active: true }]);
  };

  const toggleServiceCategory = (id: string) => {
    setServiceCatalog((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const addBrandModel = (make: string, model: string) => {
    setBrandCatalog((prev) => {
      const existing = prev.find((b) => b.make.toLowerCase() === make.toLowerCase());
      if (existing) {
        if (existing.models.includes(model)) return prev;
        return prev.map((b) => (b.id === existing.id ? { ...b, models: [...b.models, model] } : b));
      }
      return [...prev, { id: `br-${Date.now()}`, make, models: [model] }];
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <PlatformContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        role,
        setRole,
        onboardingOpen,
        setOnboardingOpen,
        ownerName,
        setOwnerName,
        ownerEmail,
        setOwnerEmail,
        ownerPhone,
        setOwnerPhone,
        ownerAvatar,
        setOwnerAvatar,
        ownerLocation,
        setOwnerLocation,
        ownerTab,
        setOwnerTab,
        vehicles,
        activeVehicleId,
        setActiveVehicleId,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        reports,
        activeReportId,
        setActiveReportId,
        createReport,
        saveReport,
        obdConnected,
        setObdConnected,
        obdAttachedToChat,
        setObdAttachedToChat,
        activeDtcs,
        setActiveDtcs,
        obdHistory,
        addObdScan,
        providers,
        selectedProviderId,
        setSelectedProviderId,
        explorePreset,
        setExplorePreset,
        openExploreWithFilter,
        openProviderProfile,
        bookings,
        createBooking,
        updateBookingStatus,
        providerDemoType,
        setProviderDemoType,
        providerSection,
        setProviderSection,
        updateProviderProfile,
        addProviderService,
        updateProviderService,
        deleteProviderService,
        feedbackRecords,
        addFeedbackRecord,
        markFeedbackReviewed,
        spareParts,
        addSparePart,
        updateSparePart,
        deleteSparePart,
        sparePartOrders,
        updateOrderStatus,
        adminSection,
        setAdminSection,
        users,
        toggleUserActive,
        verifyProvider,
        userReports,
        updateUserReportStatus,
        moderateReview,
        serviceCatalog,
        addServiceCategory,
        toggleServiceCategory,
        brandCatalog,
        addBrandModel,
        notifications,
        markAllNotificationsRead,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
