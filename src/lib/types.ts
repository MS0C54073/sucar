import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "driver" | "client" | "provider";

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date | Timestamp;
}

export interface Car {
  make: string;
  model: string;
  year: number;
  color: string;
  plate: string;
}

export interface Client {
  clientId: string;
  userId: string;
  nrcNumber: string;
  cars: Car[];
}

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

export interface Driver {
  id: string;
  driverId: string;
  userId: string;
  name: string;
  licenseNo: string;
  licenseExpiry: Date | Timestamp;
  address: string;
  maritalStatus: MaritalStatus;
  availability: boolean;
  documents: {
    nrcUrl: string;
    licenseUrl: string;
    proofOfAddressUrl: string;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface Provider {
  providerId: string;
  userId: string;
  name: string;
  location: string;
  baysCount: number;
  services: Service[];
  approved: boolean;
}

export type BookingStatus =
  | "requested"
  | "picked_up"
  | "in_wash"
  | "drying"
  | "done"
  | "delivered"
  | "cancelled";

export interface Booking {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  driverId?: string;
  driverName?: string;
  providerId: string;
  providerName: string;
  pickupLocation: string;
  carDetails: Car;
  service: Service;
  status: BookingStatus;
  timestamps: {
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    pickupAt?: Date | Timestamp;
    deliveryAt?: Date | Timestamp;
  };
  cost: number;
}

export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "cash" | "mobile_money" | "card";

export interface Payment {
  paymentId: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date | Timestamp;
}
