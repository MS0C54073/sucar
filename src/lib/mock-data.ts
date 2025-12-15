
import type { User, Driver, Client, Provider, Booking, Service, Car } from './types';

// Mock data is cleared as requested.
// A default admin will be created via the authentication flow.

export const MOCK_USERS: User[] = [];
export const MOCK_CLIENTS: Client[] = [];
export const MOCK_VEHICLES: Car[] = [];
export const MOCK_DRIVERS: Driver[] = [];
export const MOCK_SERVICES: Service[] = [
    { id: 'service-01', name: 'Full Basic Wash', description: "Complete exterior and interior cleaning.", price: 150.00, durationMinutes: 45 },
    { id: 'service-02', name: 'Engine Wash', description: "Degrease and clean the engine bay.", price: 250.00, durationMinutes: 60 },
    { id: 'service-03', name: 'Exterior Wash', description: "Thorough wash and dry of the vehicle's exterior.", price: 100.00, durationMinutes: 30 },
    { id: 'service-04', name: 'Interior Wash', description: "Vacuuming, dashboard cleaning, and window cleaning.", price: 120.00, durationMinutes: 40 },
    { id: 'service-05', name: 'Wax and Polishing', description: "Application of wax for a protective, shiny finish.", price: 350.00, durationMinutes: 90 }
];
export const MOCK_PROVIDERS: Provider[] = [];
export const MOCK_BOOKINGS: Booking[] = [];
