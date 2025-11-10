
import type { User, Driver, Client, Provider, Booking, Service, Car } from './types';

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
  },
  {
    userId: 'driver-02', // Added for Samantha
    name: 'Samantha Jones',
    email: 'samantha@sucar.com',
    phone: '222-333-4444',
    role: 'driver',
    avatarUrl: 'https://picsum.photos/seed/driver-02/100/100',
    createdAt: new Date('2023-06-01'),
  },
  {
    userId: 'driver-03', // Added for third driver
    name: 'Peter Pan',
    email: 'peter@sucar.com',
    phone: '333-444-5555',
    role: 'driver',
    avatarUrl: 'https://picsum.photos/seed/driver-03/100/100',
    createdAt: new Date('2023-07-01'),
  },
  {
    userId: 'driver-04', // Added for fourth driver
    name: 'Wendy Darling',
    email: 'wendy@sucar.com',
    phone: '444-555-6666',
    role: 'driver',
    avatarUrl: 'https://picsum.photos/seed/driver-04/100/100',
    createdAt: new Date('2023-08-01'),
  },
];

// Mock Clients
export const MOCK_CLIENTS: Client[] = [
  {
    clientId: 'client-01-data',
    userId: 'client-01',
    nrcNumber: '123456/78/9',
  },
  {
    clientId: 'client-02-data',
    userId: 'client-02',
    nrcNumber: '987654/32/1',
  }
];

export const MOCK_VEHICLES: Car[] = [
    { vehicleId: 'veh-01', clientId: 'client-01', make: 'Toyota', model: 'Mark X', plate_no: 'BLB 57', color: 'Black' },
    { vehicleId: 'veh-02', clientId: 'client-01', make: 'BMW', model: 'X5', plate_no: 'BCA 123', color: 'White' },
    { vehicleId: 'veh-03', clientId: 'client-02', make: 'Ford', model: 'Ranger', plate_no: 'DEF 456', color: 'Blue' },
    { vehicleId: 'veh-04', clientId: 'client-02', make: 'Mercedes-Benz', model: 'C-Class', plate_no: 'GHI 789', color: 'Silver' },
];

// Mock Drivers
export const MOCK_DRIVERS: Driver[] = [
  {
    driverId: 'driver-01-data',
    userId: 'driver-01',
    name: "Bob Williams",
    phone: '777-888-9999',
    licenseNo: 'DL123456',
    address: '123 Main St, Anytown',
    maritalStatus: 'single',
    availability: true,
    documents: {
        nrcUrl: 'http://example.com/nrc.pdf',
        licenseUrl: 'http://example.com/license.pdf',
        proofOfAddressUrl: 'http://example.com/utility.pdf'
    },
    approved: true
  },
  {
    driverId: 'driver-02-data',
    userId: 'driver-02',
    name: "Samantha Jones",
    phone: '222-333-4444',
    licenseNo: 'DL654321',
    address: '456 Oak Ave, Otherville',
    maritalStatus: 'married',
    availability: false,
     documents: {},
    approved: true // Approved for map visibility
  },
  {
    driverId: 'driver-03-data',
    userId: 'driver-03',
    name: "Peter Pan",
    phone: '333-444-5555',
    licenseNo: 'DL789012',
    address: '789 Pine St, Neverland',
    maritalStatus: 'single',
    availability: true,
    documents: {},
    approved: true,
  },
  {
    driverId: 'driver-04-data',
    userId: 'driver-04',
    name: 'Wendy Darling',
    phone: '444-555-6666',
    licenseNo: 'DL345678',
    address: '101 Star Ave, London',
    maritalStatus: 'single',
    availability: false,
    documents: {},
    approved: false, // Not approved, won't show on map
  },
];

// Mock Services
export const MOCK_SERVICES: Service[] = [
    { id: 'service-01', name: 'Full Basic Wash', description: "Complete exterior and interior cleaning.", price: 150.00, durationMinutes: 45 },
    { id: 'service-02', name: 'Engine Wash', description: "Degrease and clean the engine bay.", price: 250.00, durationMinutes: 60 },
    { id: 'service-03', name: 'Exterior Wash', description: "Thorough wash and dry of the vehicle's exterior.", price: 100.00, durationMinutes: 30 },
    { id: 'service-04', name: 'Interior Wash', description: "Vacuuming, dashboard cleaning, and window cleaning.", price: 120.00, durationMinutes: 40 },
    { id: 'service-05', name: 'Wax and Polishing', description: "Application of wax for a protective, shiny finish.", price: 350.00, durationMinutes: 90 }
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
    bookingId: 'booking-01',
    clientId: 'client-01', // Alice Johnson
    driverId: 'driver-01-data', // Bob Williams
    providerId: 'provider-01',
    pickupLocation: 'Acacia Park, Lusaka',
    vehicle: MOCK_VEHICLES[0],
    status: 'confirmed', // Starts at 'confirmed' for simulation
    createdAt: new Date(),
    cost: 150.00,
  },
  {
    bookingId: 'booking-02',
    clientId: 'client-02', // Charlie Brown
    driverId: 'driver-02-data', // Samantha Jones
    providerId: 'provider-01',
    pickupLocation: 'Manda Hill, Lusaka',
    vehicle: MOCK_VEHICLES[2],
    status: 'picked_up',
    createdAt: new Date(Date.now() - 3600000),
    cost: 100.00,
  },
  {
    bookingId: 'booking-03',
    clientId: 'client-01', // Alice Johnson
    driverId: 'driver-03-data', // Peter Pan
    providerId: 'provider-01',
    pickupLocation: 'East Park Mall, Lusaka',
    vehicle: MOCK_VEHICLES[1],
    status: 'requested',
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    cost: 350.00,
  },
  {
    bookingId: 'booking-04',
    clientId: 'client-02', // Charlie Brown
    driverId: 'driver-01-data', // Bob Williams
    providerId: 'provider-01',
    pickupLocation: 'Levy Junction, Lusaka',
    vehicle: MOCK_VEHICLES[3],
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    cost: 250.00,
  },
    {
    bookingId: 'booking-05',
    clientId: 'client-01', // Alice Johnson
    driverId: 'driver-02-data', // Samantha Jones
    providerId: 'provider-01',
    pickupLocation: 'Arcades, Lusaka',
    vehicle: MOCK_VEHICLES[0],
    status: 'cancelled',
    createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
    cost: 150.00,
  },
];
