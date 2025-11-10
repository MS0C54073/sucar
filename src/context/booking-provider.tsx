
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
} from "@/lib/mock-data";
import type { Booking, BookingStatus, Driver, User } from "@/lib/types";

interface BookingContextType {
  bookings: Booking[];
  drivers: Driver[];
  users: User[];
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  setBookings: React.Dispatch<SetStateAction<Booking[]>>;
}

const BookingContext = createContext<BookingContextType | undefined>(
  undefined
);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

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
    users,
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
