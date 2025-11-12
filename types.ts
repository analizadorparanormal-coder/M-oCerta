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
}

export type User = Client | Professional;

export interface QuoteMessage {
  sender: 'client' | 'professional';
  text: string;
  timestamp: Date;
  isOffer?: boolean;
  offerDetails?: {
    value: number;
    visitDate: string;
    visitFee?: number;
  };
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
}


export interface Denunciation {
    id: string;
    client: Client;
    professional: Professional;
    reason: string;
    description: string;
    date: Date;
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