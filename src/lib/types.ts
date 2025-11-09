
import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "driver" | "client" | "provider";

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Car {
  vehicleId: string;
  clientId: string;
  make: string;
  model: string;
  plate_no: string; // Changed from plate
  color: string;
}

export interface Client {
  clientId: string;
  userId: string;
  nrcNumber: string;
  // cars are now a separate collection
}

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

export interface Driver {
  driverId: string;
  userId: string;
  name: string; // Duplicated for easy access
  phone: string;
  licenseNo: string;
  address: string;
  maritalStatus: MaritalStatus;
  availability: boolean;
  documents: {
    nrcUrl?: string;
    licenseUrl?: string;
    proofOfAddressUrl?: string;
  };
  approved: boolean; // For admin approval
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
  approved: boolean; // For admin approval
}

export type BookingStatus =
  | "requested"
  | "confirmed" // Driver has accepted
  | "picked_up"
  | "in_wash"
  | "drying"
  | "done" // Wash complete, ready for delivery
  | "delivered"
  | "cancelled";

export interface Booking {
  bookingId: string;
  clientId: string;
  driverId: string;
  pickupLocation: string;
  status: BookingStatus;
  createdAt: Date;
  // Other fields from spec to be added later
  vehicle: Car;
  providerId: string;
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
  createdAt: Date;
}
