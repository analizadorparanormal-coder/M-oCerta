
export enum UserRole {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN'
}

export enum Profession {
  ELECTRICIAN = 'Eletricista',
  MASON = 'Pedreiro',
  TILER = 'Azulejista',
  POOL_CLEANER = 'Piscineiro',
  PLUMBER = 'Encanador',
  LEAK_DETECTOR = 'Caça-vazamento',
  GARDENER = 'Jardineiro',
  IRONER = 'Passadeira',
  ELDERLY_CAREGIVER = 'Cuidador de Idosos',
  NANNY = 'Babá',
  HOUSEKEEPER = 'Diarista',
}

interface BaseUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profilePictureUrl: string;
  role: UserRole;
}

export interface Client extends BaseUser {
  role: UserRole.CLIENT;
}

export interface Review {
  clientName: string;
  rating: number; // 1 to 5
  comment: string;
  date: Date;
}

export interface Professional extends BaseUser {
  role: UserRole.PROFESSIONAL;
  cpfCnpj: string;
  profession: Profession;
  experience: string;
  bankAccount: string;
  pixKey?: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  distance: number;
  isAvailable: boolean;
  activeClients: number;
  servicesHistory: { clientName: string; service: string; date: string }[];
  services: string[];
  warnings?: string[];
  blockedUntil?: string;
  monthlyEarnings?: number;
  acceptanceRate?: number;
}

export type User = Client | Professional;

export interface OfferDetails {
  laborCost: number;
  materials: { name: string; price: number }[];
  visitFee: number; // 0 if not charged
  total: number;
  visitDate: string;
}

export interface QuoteMessage {
  sender: 'client' | 'professional';
  text: string; // For offers, this will hold the description of the service.
  timestamp: Date;
  isOffer?: boolean;
  offerDetails?: OfferDetails;
  isRead?: boolean;
  isVisitOffer?: boolean;
}

export interface Quote {
  id: string;
  from: Client;
  to: Professional;
  messages: QuoteMessage[];
  status: 'pending' | 'answered' | 'accepted' | 'rejected' | 'scheduled' | 'completed';
  scheduledVisit?: string;
  hasBeenRated?: boolean;
  professionalEnRoute?: boolean;
  eta?: string;
  paymentStatus?: 'unpaid' | 'requested' | 'paid';
  transitUpdate?: { text: string; timestamp: Date };
}


export interface Denunciation {
    id: string;
    client: Client;
    professional: Professional;
    date: Date;
    // FIX: Added missing properties 'reason' and 'description' to the Denunciation interface to match the implementation in constants.ts and App.tsx.
    reason: string;
    description: string;
}

export interface Banner {
    id: string;
    imageUrl: string;
    title: string;
    link: string;
}

export interface SupportMessage {
  senderId: string; // 'admin' or user.id
  senderName: string;
  text: string;
  timestamp: Date;
}

export interface SupportTicket {
  id: string;
  clientOrProfessional: Client | Professional;
  subject: string;
  messages: SupportMessage[];
  status: 'open' | 'closed';
  createdAt: Date;
}