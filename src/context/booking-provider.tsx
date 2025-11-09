
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
} from "@/lib/mock-data";
import type { Booking, BookingStatus, Driver } from "@/lib/types";

interface BookingContextType {
  bookings: Booking[];
  drivers: Driver[];
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  setBookings: React.Dispatch<SetStateAction<Booking[]>>;
}

const BookingContext = createContext<BookingContextType | undefined>(
  undefined
);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);

  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };

  const value = {
    bookings,
    drivers,
    updateBookingStatus,
    setBookings,
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
