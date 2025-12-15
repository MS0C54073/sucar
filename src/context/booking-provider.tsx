
"use client";

import {
  useState,
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
} from "react";
import {
  MOCK_BOOKINGS,
  MOCK_DRIVERS,
  MOCK_USERS,
  MOCK_PROVIDERS
} from "@/lib/mock-data";
import type { Booking, BookingStatus, Driver, User, Provider, PaymentStatus } from "@/lib/types";

// The Finite State Machine for booking status progression.
// This is the SINGLE SOURCE OF TRUTH for status transitions.
const statusProgression: Record<BookingStatus, BookingStatus | null> = {
  requested: "confirmed",
  confirmed: "picked_up",
  picked_up: "in_wash",
  in_wash: "drying",
  drying: "done",
  done: "delivered",
  delivered: null,
  cancelled: null,
};

// Defines the button text for the next action a driver can take.
const nextStatusButtonText: Partial<Record<BookingStatus, string>> = {
    requested: "Accept Job",
    confirmed: "Confirm Pickup",
    picked_up: "Arrived at Car Wash",
    in_wash: "Mark as Drying",
    drying: "Mark as Ready for Delivery",
    done: "Confirm Delivery to Client",
};


interface BookingContextType {
  bookings: Booking[];
  drivers: Driver[];
  users: User[];
  providers: Provider[];
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  updateBookingPaymentStatus: (bookingId: string, newStatus: PaymentStatus) => void;
  addBooking: (booking: Booking) => void;
  setBookings: React.Dispatch<SetStateAction<Booking[]>>;
  setDrivers: React.Dispatch<SetStateAction<Driver[]>>;
  setProviders: React.Dispatch<SetStateAction<Provider[]>>;
  getNextStatus: (currentStatus: BookingStatus) => BookingStatus | null;
  getNextStatusText: (currentStatus: BookingStatus) => string;
}

const BookingContext = createContext<BookingContextType | undefined>(
  undefined
);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);


  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };
  
  const updateBookingPaymentStatus = (bookingId: string, newStatus: PaymentStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === bookingId
          ? { ...booking, paymentStatus: newStatus }
          : booking
      )
    );
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  }

  const getNextStatus = (currentStatus: BookingStatus) => {
    return statusProgression[currentStatus];
  };

  const getNextStatusText = (currentStatus: BookingStatus) => {
    return nextStatusButtonText[currentStatus] || "Update Status";
  }

  const value = {
    bookings,
    drivers,
    users,
    providers,
    updateBookingStatus,
    updateBookingPaymentStatus,
    addBooking,
    setBookings,
    setDrivers,
    setProviders,
    getNextStatus,
    getNextStatusText,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
