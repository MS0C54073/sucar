# **App Name**: SuCAR: Car Wash Pickup System

## Core Features:

- User Authentication: Secure authentication system using Firebase Auth, supporting email/password and optional social logins.
- Role-Based Access Control: Implement role-based access control to restrict access to features based on user roles (admin, driver, client, provider).
- Booking Management: Clients can book car wash pickups by specifying pickup location, car details, and desired services.
- Real-Time Booking Tracking: Track bookings in real-time using Firestore listeners, updating status as the car moves through the wash process.
- Driver Management: Drivers can manage their assigned trips, update the booking status, and provide ETAs.
- Service Provider Dashboard: Car wash providers can manage their services, pricing, bay availability, and internal status tracking.
- Route Optimization Tool: The application should utilize AI as a tool to decide which route for drivers is optimal in the event of road closures and other events impacting travel time.

## Style Guidelines:

- Primary color: Sky blue (#72BCD4) to evoke cleanliness and efficiency.
- Background color: Light gray (#F0F4F7) to provide a clean and neutral backdrop.
- Accent color: Teal (#26A69A) for calls to action and highlights.
- Body and headline font: 'PT Sans', a humanist sans-serif, which lends a modern look and a little warmth or personality; suitable for headlines or body text.
- Code font: 'Source Code Pro' for displaying code snippets in settings or admin panels.
- Use consistent, clear icons for navigation and status indicators, ensuring they are intuitive and match the car wash theme.
- Subtle animations to indicate loading states and booking status updates.