# SuCAR: Car Wash Pickup & Delivery System

## Overview

SuCAR is a comprehensive, multi-faceted application designed to modernize the car care experience in Lusaka, Zambia. It provides a seamless and convenient platform that connects car owners with trusted drivers and top-rated car wash service providers.

The core mission of SuCAR is to eliminate the time and hassle car owners spend driving to and from car washes. By leveraging a real-time, map-based interface and role-specific dashboards, SuCAR creates a complete ecosystem for effortless car care, from booking to payment to delivery.

## Key Features

The platform is built with distinct user roles, each with a tailored dashboard and functionalities to ensure a smooth workflow for everyone involved.

### For Clients
- **Easy Booking**: Schedule a car wash pickup in just a few taps through a user-friendly interface.
- **Service Selection**: Choose from a list of vetted car wash providers based on location and services offered.
- **Real-Time Tracking**: Monitor your vehicle's journey from your location to the car wash and back on a live map.
- **Secure Payments**: Pay for services securely within the app using multiple methods, including mobile money and credit/debit cards.
- **Downloadable Receipts**: Receive and download a branded PDF receipt after every successful payment.
- **Booking History**: Keep a detailed record of all past services and payments.
- **Profile & Vehicle Management**: Easily update personal information and manage a list of your vehicles.

### For Drivers
- **Trip Management**: View and manage assigned pickups and deliveries in a clear, concise dashboard.
- **AI Route Optimization**: Utilize an AI-powered tool to calculate the most efficient routes, saving time and fuel.
- **Availability Toggle**: Set your work availability to start accepting new job requests.
- **Profile & Document Management**: Upload and manage required documents, such as your driver's license and NRC, for verification.

### For Car Wash Providers
- **Service & Pricing Management**: Add, edit, and manage the list of car wash services and prices you offer.
- **Incoming Vehicle Tracking**: Track drivers who are en route to your location for a service.
- **Booking Management**: View and manage all bookings directed to your car wash.
- **Business Profile**: Manage your business name, location, and other details.

### For Administrators
- **Centralized Dashboard**: Get a complete overview of platform activity, including revenue, bookings, and user metrics.
- **Live Fleet Tracking**: Monitor the real-time location and status of all active drivers on a single map.
- **User Management**: Approve, monitor, and manage all drivers and service providers on the platform.
- **Platform Analytics**: View analytics on booking history, revenue trends, and system performance.
- **AI-Powered Insights**: Receive AI-generated financial advice and system error reports to guide business decisions.

## Technology Stack

SuCAR is built on a modern, robust, and scalable technology stack:

- **Frontend**: [Next.js](https://nextjs.org/) with React (App Router)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Firebase Authentication, Firebase Storage)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components
- **Generative AI**: [Google's Genkit](https://firebase.google.com/docs/genkit) for AI-powered features like route optimization.
- **Mapping**: [Mapbox](https://www.mapbox.com/) for live location tracking and map displays.
- **Deployment**: Firebase App Hosting

## Getting Started

To get started with the development environment:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

This project is configured to work seamlessly within Firebase Studio, with automatic package installation and backend provisioning.
