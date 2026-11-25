export type Language = 'en' | 'ar';
export type UserRole = 'car_owner' | 'provider' | 'admin';
export type ProviderType = 'workshop' | 'service_center' | 'spare_parts';
export type OwnerTab =
  | 'home'
  | 'garage'
  | 'explore'
  | 'history'
  | 'profile'
  | 'ai_chat'
  | 'diagnostic_report'
  | 'provider_profile'
  | 'obd';

export type ProviderSection =
  | 'overview'
  | 'profile'
  | 'services'
  | 'compatibility'
  | 'requests'
  | 'feedback'
  | 'inventory'
  | 'products'
  | 'orders';

export type AdminSection =
  | 'overview'
  | 'users'
  | 'providers'
  | 'platform'
  | 'ai_monitoring';

export interface BiText {
  en: string;
  ar: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engineType: string;
  fuelType: 'Petrol' | 'Hybrid' | 'Diesel' | 'Electric';
  transmission: 'Automatic' | 'CVT' | 'Manual';
  plateNumber: string;
  mileageKm: number;
  imageUrl?: string;
  color: BiText;
  lastServiceDate: string;
}

export type LikelihoodLevel = 'high' | 'medium' | 'low';
export type RiskLevel = 'high' | 'moderate' | 'low';

export interface DiagnosticCause {
  id: string;
  title: BiText;
  likelihood: LikelihoodLevel;
  explanation: BiText;
  estimatedInspection: BiText;
}

export interface DiagnosticReport {
  id: string;
  vehicleId: string;
  vehicleLabel: string;
  createdAt: string;
  summary: BiText;
  reportedSymptoms: BiText[];
  riskLevel: RiskLevel;
  safetyNotice: BiText;
  causes: DiagnosticCause[];
  recommendedInspection: BiText;
  recommendedCategory: ProviderType;
  recommendedServiceTag: string;
  linkedDtcCodes?: string[];
  saved: boolean;
}

export interface DiagnosticMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedOptions?: { id: string; label: BiText }[];
  attachment?: {
    type: 'image' | 'audio';
    label: string;
    previewUrl?: string;
  };
  linkedReportId?: string;
}

export interface ProviderService {
  id: string;
  name: BiText;
  description: BiText;
  estimatedPrice: string;
  duration: BiText;
  category: string;
  supportedBrands: string[];
}

export interface ProviderReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  vehicle: string;
  comment: BiText;
  status: 'approved' | 'flagged' | 'hidden';
}

export interface Provider {
  id: string;
  type: ProviderType;
  name: BiText;
  ownerName: BiText;
  description: BiText;
  verified: boolean;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  distanceKm: number;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  workingHours: BiText;
  address: BiText;
  phone: string;
  email: string;
  coverImage: string;
  galleryImages: string[];
  supportedBrands: string[];
  supportedModels: string[];
  supportedYears: string;
  vehicleCategories: string[];
  serviceCategories: string[];
  services: ProviderService[];
  reviews: ProviderReview[];
  mapCoords: { x: number; y: number };
  verificationDocs: { name: BiText; status: 'submitted' | 'verified' | 'missing' }[];
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed';

export interface BookingRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: BiText;
  vehicleId: string;
  vehicleSummary: string;
  reportedProblem: BiText;
  aiDiagnosticSummary?: BiText;
  diagnosticReportId?: string;
  requestedService: BiText;
  preferredDate: string;
  preferredTime: string;
  status: BookingStatus;
  notes?: string;
  estimatedCost?: string;
  feedbackSubmitted?: boolean;
}

export interface DiagnosticFeedbackRecord {
  id: string;
  bookingId: string;
  vehicleSummary: string;
  reportedSymptom: BiText;
  aiPredictedFault: BiText;
  actualDiagnosedFault: BiText;
  confirmedFailedComponent: BiText;
  repairPerformed: BiText;
  sparePartsUsed: BiText;
  finalStatus: 'resolved' | 'follow_up_required';
  mechanicName: string;
  providerName: BiText;
  submittedAt: string;
  matchedAiPrediction: boolean;
  reviewStatus: 'verified' | 'needs_review';
}

export interface SparePartProduct {
  id: string;
  name: BiText;
  sku: string;
  category: BiText;
  compatibleMakes: string[];
  compatibleModels: string[];
  priceSar: number;
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  imageUrl?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

export interface SparePartOrder {
  id: string;
  customerName: string;
  vehicleInfo: string;
  productId: string;
  productName: BiText;
  quantity: number;
  totalSar: number;
  orderDate: string;
  status: OrderStatus;
}

export interface PlatformUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'car_owner' | 'workshop' | 'service_center' | 'spare_parts';
  city: BiText;
  vehiclesCount: number;
  bookingsCount: number;
  active: boolean;
  joinedDate: string;
}

export interface DtcCode {
  code: string;
  system: BiText;
  severity: RiskLevel;
  description: BiText;
  relatedSymptom: BiText;
}

export interface ObdLiveData {
  rpm: number;
  speedKmh: number;
  coolantTempC: number;
  batteryVolts: number;
  fuelTrimPct: number;
  intakeTempC: number;
}

export interface ObdScanRecord {
  id: string;
  vehicleLabel: string;
  scannedAt: string;
  dtcCount: number;
  codes: string[];
  batteryVolts: number;
  coolantTempC: number;
}

export interface UserReportItem {
  id: string;
  reporter: string;
  targetName: BiText;
  reason: BiText;
  date: string;
  status: 'open' | 'resolved' | 'dismissed';
}

export interface PlatformNotification {
  id: string;
  title: BiText;
  body: BiText;
  time: BiText;
  read: boolean;
  targetTab?: OwnerTab;
}
