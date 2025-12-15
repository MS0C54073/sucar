
import type { User, Driver, Client, Provider, Booking, Service, Car } from './types';

export const MOCK_USERS: User[] = [
    {
        userId: 'client-01',
        name: 'Bwalya Chanda',
        email: 'bwalya.chanda@example.com',
        phone: '0977123456',
        role: 'client',
        avatarUrl: 'https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA',
        createdAt: new Date(),
    },
    {
        userId: 'driver-01-data',
        name: 'John Banda',
        email: 'john.banda@example.com',
        phone: '0966789012',
        role: 'driver',
        avatarUrl: 'https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA',
        createdAt: new Date(),
    }
];

export const MOCK_CLIENTS: Client[] = [
    {
        clientId: 'client-01',
        userId: 'client-01',
        nrcNumber: '123456/10/1',
    }
];

export const MOCK_VEHICLES: Car[] = [
    { vehicleId: 'veh-01', clientId: 'client-01', make: 'Toyota', model: 'Mark X', plate_no: 'ABC 123', color: 'White' },
    { vehicleId: 'veh-02', clientId: 'client-01', make: 'Ford', model: 'Ranger', plate_no: 'XYZ 789', color: 'Black' },
];

export const MOCK_DRIVERS: Driver[] = [
    {
        driverId: 'driver-01-data',
        userId: 'driver-01-data',
        name: 'John Banda',
        phone: '0966789012',
        licenseNo: 'DL12345',
        address: '123 Chainama, Lusaka',
        maritalStatus: 'single',
        availability: true,
        documents: {},
        approved: true,
    }
];

export const MOCK_SERVICES: Service[] = [
    { id: 'service-01', name: 'Full Basic Wash', description: "Complete exterior and interior cleaning.", price: 150.00, durationMinutes: 45 },
    { id: 'service-02', name: 'Engine Wash', description: "Degrease and clean the engine bay.", price: 250.00, durationMinutes: 60 },
    { id: 'service-03', name: 'Exterior Wash', description: "Thorough wash and dry of the vehicle's exterior.", price: 100.00, durationMinutes: 30 },
    { id: 'service-04', name: 'Interior Wash', description: "Vacuuming, dashboard cleaning, and window cleaning.", price: 120.00, durationMinutes: 40 },
    { id: 'service-05', name: 'Wax and Polishing', description: "Application of wax for a protective, shiny finish.", price: 350.00, durationMinutes: 90 }
];

export const MOCK_PROVIDERS: Provider[] = [
    { providerId: 'provider-01-data', userId: 'provider-01', name: 'Sparkle Car Wash', location: 'East Park Mall', baysCount: 5, services: MOCK_SERVICES, approved: true },
    { providerId: 'provider-02-data', userId: 'provider-02', name: 'AutoShine Experts', location: 'Arcades Shopping Mall', baysCount: 3, services: MOCK_SERVICES.slice(0, 3), approved: true },
    { providerId: 'provider-03-data', userId: 'provider-03', name: 'Gleam Team', location: 'Mandevu', baysCount: 4, services: MOCK_SERVICES, approved: false },
    { providerId: 'provider-04-data', userId: 'provider-04', name: 'The Wash Bay', location: 'Kabulonga', baysCount: 6, services: MOCK_SERVICES.slice(1, 4), approved: true },
    { providerId: 'provider-05-data', userId: 'provider-05', name: 'HydroClean', location: 'Woodlands', baysCount: 2, services: MOCK_SERVICES.slice(2, 5), approved: true },
];

export const MOCK_BOOKINGS: Booking[] = [
    {
        bookingId: 'booking-01',
        clientId: 'client-01',
        driverId: 'driver-01-data',
        pickupLocation: 'Acacia Park, Lusaka',
        status: 'in_wash',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        vehicle: MOCK_VEHICLES[0],
        providerId: 'provider-01-data',
        cost: 150.00
    },
    {
        bookingId: 'booking-02',
        clientId: 'client-01',
        driverId: 'driver-01-data',
        pickupLocation: 'Roma, Lusaka',
        status: 'delivered',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
        vehicle: MOCK_VEHICLES[1],
        providerId: 'provider-02-data',
        cost: 250.00
    },
];
