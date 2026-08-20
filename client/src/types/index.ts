export interface Service {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  detailedDescriptionEn?: string | null;
  detailedDescriptionAr?: string | null;
  image?: string | null;
  icon?: string | null;
  price?: number | null;
  duration?: string | null;
  warranty?: string | null;
  category?: string | null;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface Booking {
  id: string;
  serviceId?: string | null;
  service?: Service | null;
  vehicleType: string;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: string | null;
  vehicleColor?: string | null;
  customerName: string;
  phone: string;
  whatsapp?: string | null;
  preferredDate: string;
  preferredTime: string;
  notes?: string | null;
  status: BookingStatus;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  captionEn?: string | null;
  captionAr?: string | null;
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface BeforeAfterItem {
  id: string;
  vehicleName: string;
  vehicleCategory?: string | null;
  beforeImage: string;
  afterImage: string;
  serviceName?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  date?: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  reviewEn: string;
  reviewAr?: string | null;
  vehicle?: string | null;
  customerImage?: string | null;
  date: string;
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

export interface LocationItem {
  id: string;
  name: string;
  nameAr?: string | null;
  address: string;
  addressAr?: string | null;
  lat?: number | null;
  lng?: number | null;
  wazeUrl?: string | null;
  googleMapsUrl?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  workingHours?: string | null;
  active: boolean;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  image: string;
  captionEn?: string | null;
  captionAr?: string | null;
  link?: string | null;
  postedAt?: string | null;
  order: number;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  logo?: string | null;
  favicon?: string | null;
  primaryColor: string;
  secondaryColor: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  snapchat?: string | null;
  tiktok?: string | null;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  ogImage?: string | null;
  keywords?: string | null;
  maintenanceMode: boolean;
  bookingEnabled: boolean;
  instagramEnabled: boolean;
  reviewsEnabled: boolean;
  experienceTitleEn?: string | null;
  experienceTitleAr?: string | null;
  experienceBodyEn?: string | null;
  experienceBodyAr?: string | null;
  experienceImage1?: string | null;
  experienceImage2?: string | null;
  experienceStats?: string | null;
  updatedAt: string;
}

export interface ExperienceStat {
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
}

export interface Overview {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  services: number;
  galleryItems: number;
  reviews: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}
