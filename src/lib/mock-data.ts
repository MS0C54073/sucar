import type { User, Driver, Client, Provider, Booking, Service } from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    userId: 'admin-01',
    name: 'SuCAR Admin',
    email: 'admin@sucar.com',
    phone: '111-222-3333',
    role: 'admin',
    avatarUrl: 'https://picsum.photos/seed/admin-01/100/100',
    createdAt: new Date('2023-01-01'),
  },
  {
    userId: 'client-01',
    name: 'Alice Johnson',
    email: 'client@sucar.com',
    phone: '444-555-6666',
    role: 'client',
    avatarUrl: 'https://picsum.photos/seed/client-01/100/100',
    createdAt: new Date('2023-02-15'),
  },
  {
    userId: 'driver-01',
    name: 'Bob Williams',
    email: 'driver@sucar.com',
    phone: '777-888-9999',
    role: 'driver',
    avatarUrl: 'https://picsum.photos/seed/driver-01/100/100',
    createdAt: new Date('2023-03-10'),
  },
  {
    userId: 'provider-01',
    name: 'SparkleClean Wash',
    email: 'provider@sucar.com',
    phone: '123-456-7890',
    role: 'provider',
    avatarUrl: 'https://picsum.photos/seed/provider-01/100/100',
    createdAt: new Date('2023-04-01'),
  },
  {
    userId: 'client-02',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '555-123-4567',
    role: 'client',
    avatarUrl: 'https://picsum.photos/seed/client-02/100/100',
    createdAt: new Date('2023-05-20'),
  }
];

// Mock Clients
export const MOCK_CLIENTS: Client[] = [
  {
    clientId: 'client-01-data',
    userId: 'client-01',
    nrcNumber: '123456/78/9',
    cars: [
      { make: 'Toyota', model: 'Corolla', year: 2020, color: 'Silver', plate: 'ABC 123' },
      { make: 'Ford', model: 'Ranger', year: 2021, color: 'Blue', plate: 'DEF 456' },
    ],
  },
];

// Mock Drivers
export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'driver-01-data',
    driverId: 'driver-01-data',
    userId: 'driver-01',
    name: "Bob Williams",
    licenseNo: 'DL123456',
    licenseExpiry: new Date('2025-12-31'),
    address: '123 Main St, Anytown',
    maritalStatus: 'single',
    availability: true,
    documents: {
        nrcUrl: 'http://example.com/nrc.pdf',
        licenseUrl: 'http://example.com/license.pdf',
        proofOfAddressUrl: 'http://example.com/utility.pdf'
    }
  },
  {
    id: 'driver-02-data',
    driverId: 'driver-02-data',
    userId: 'driver-02',
    name: "Samantha Jones",
    licenseNo: 'DL654321',
    licenseExpiry: new Date('2026-10-20'),
    address: '456 Oak Ave, Otherville',
    maritalStatus: 'married',
    availability: false,
    documents: {
        nrcUrl: 'http://example.com/nrc.pdf',
        licenseUrl: 'http://example.com/license.pdf',
        proofOfAddressUrl: 'http://example.com/utility.pdf'
    }
  }
];

// Mock Services
export const MOCK_SERVICES: Service[] = [
    { id: 'service-01', name: 'Full Basic Wash', description: "Complete exterior and interior cleaning.", price: 25.00, durationMinutes: 45 },
    { id: 'service-02', name: 'Engine Wash', description: "Degrease and clean the engine bay.", price: 40.00, durationMinutes: 60 },
    { id: 'service-03', name: 'Exterior Wash', description: "Thorough wash and dry of the vehicle's exterior.", price: 15.00, durationMinutes: 30 },
    { id: 'service-04', name: 'Interior Wash', description: "Vacuuming, dashboard cleaning, and window cleaning.", price: 20.00, durationMinutes: 40 },
    { id: 'service-05', name: 'Wax and Polishing', description: "Application of wax for a protective, shiny finish.", price: 50.00, durationMinutes: 90 }
];

// Mock Providers
export const MOCK_PROVIDERS: Provider[] = [
  {
    providerId: 'provider-01-data',
    userId: 'provider-01',
    name: 'SparkleClean Wash',
    location: '789 Market St',
    baysCount: 4,
    services: MOCK_SERVICES,
    approved: true,
  },
];

// Mock Bookings
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking-01',
    bookingId: 'booking-01',
    clientId: 'client-01',
    clientName: 'Alice Johnson',
    driverId: 'driver-01',
    driverName: 'Bob Williams',
    providerId: 'provider-01',
    providerName: 'SparkleClean Wash',
    pickupLocation: '123 Client Ave',
    carDetails: { make: 'Toyota', model: 'Corolla', year: 2020, color: 'Silver', plate: 'ABC 123' },
    service: MOCK_SERVICES[0],
    status: 'in_wash',
    timestamps: { createdAt: new Date(), updatedAt: new Date() },
    cost: 25.00,
  },
  {
    id: 'booking-02',
    bookingId: 'booking-02',
    clientId: 'client-02',
    clientName: 'Charlie Brown',
    driverId: 'driver-01',
    driverName: 'Bob Williams',
    providerId: 'provider-01',
    providerName: 'SparkleClean Wash',
    pickupLocation: '456 Client Rd',
    carDetails: { make: 'Honda', model: 'Civic', year: 2022, color: 'Red', plate: 'XYZ 789' },
    service: MOCK_SERVICES[2],
    status: 'picked_up',
    timestamps: { createdAt: new Date(Date.now() - 3600000), updatedAt: new Date() },
    cost: 15.00,
  }
];
