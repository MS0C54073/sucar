
"use client";

import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, Popup, Source, Layer, MapRef } from "react-map-gl";
import { Card } from "@/components/ui/card";
import { Car, MapPin, Wrench, User as UserIcon, ShieldAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Driver, Booking, BookingStatus } from "@/lib/types";
import { useAuth } from "@/context/auth-provider";
import { useBooking } from "@/context/booking-provider";
import { Separator } from "../ui/separator";

// Define key locations in Lusaka
const USER_LOCATION = { longitude: 28.2814, latitude: -15.4167 }; // Lusaka center
const CAR_WASH_LOCATION = { longitude: 28.3228, latitude: -15.3986 }; // East Park Mall area

// Pre-defined initial positions for drivers
const initialDriverPositions: Record<string, { longitude: number; latitude: number }> = {
  "driver-01-data": { longitude: 28.2750, latitude: -15.4200 },
  "driver-02-data": { longitude: 28.2900, latitude: -15.4100 },
  "driver-03-data": { longitude: 28.2850, latitude: -15.4250 },
  "driver-04-data": { longitude: 28.3000, latitude: -15.4300 },
};

interface Position {
  longitude: number;
  latitude: number;
}

interface SimulatedDriver extends Driver {
  position: Position;
  user: any; 
  bookingId?: string;
  bookingStatus?: BookingStatus;
  eta?: number; // ETA in seconds
}

type MapPerspective = "client" | "driver" | "provider" | "admin";

interface MapViewProps {
    perspective: MapPerspective;
    activeBooking?: Booking;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const routeLayer: mapboxgl.LineLayer = {
  id: 'route',
  type: 'line',
  source: 'route',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#3b82f6',
    'line-width': 6,
    'line-opacity': 0.8
  }
};

const driverStatusColors: Record<string, string> = {
    available: "text-green-500", // available
    confirmed: "text-blue-500", // en route to pickup
    picked_up: "text-yellow-500", // en route to wash
    in_wash: "text-yellow-500", // en route to wash
    drying: "text-yellow-500", // en route to wash
    done: "text-orange-500", // returning to client
    unavailable: "text-red-500",
}


async function getRoute(start: Position, end: Position) {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch route");
    const json = await res.json();
    const routeData = json.routes[0];
    return {
      coordinates: routeData?.geometry.coordinates || null,
      duration: routeData?.duration || 0, // Duration in seconds
    }
  } catch (error) {
    console.error("Mapbox Route Error:", error);
    return null;
  }
}

export function LiveMapView({ perspective, activeBooking }: MapViewProps) {
  const { user } = useAuth();
  const { drivers: allDrivers, bookings: allBookings, users: allUsers, providers } = useBooking();

  const [simDrivers, setSimDrivers] = useState<SimulatedDriver[]>([]);
  const [routes, setRoutes] = useState<Record<string, any>>({});
  const [selectedDriver, setSelectedDriver] = useState<SimulatedDriver | null>(null);
  const mapRef = useRef<MapRef>(null);

  // Initialize and update drivers based on bookings
  useEffect(() => {
    const initializedDrivers = allDrivers.map(driver => {
      const userDetails = allUsers.find(u => u.userId === driver.userId);
      const booking = allBookings.find(b => b.driverId === driver.driverId && b.status !== 'delivered' && b.status !== 'cancelled');
      return {
        ...driver,
        user: userDetails,
        position: initialDriverPositions[driver.driverId] || USER_LOCATION,
        bookingId: booking?.bookingId,
        bookingStatus: booking?.status
      };
    });
    setSimDrivers(initializedDrivers);
  }, [allDrivers, allBookings, allUsers]);

  // Simulation and Route Fetching Loop
  useEffect(() => {
    let animationFrameId: number;
    const routePoints: Record<string, number[][]> = {};
    const routeIndices: Record<string, number> = {};

    const animate = async () => {
      const newDriverStates = [...simDrivers];
      const newRoutes = {...routes};

      for (let i = 0; i < newDriverStates.length; i++) {
        const driver = newDriverStates[i];
        const booking = allBookings.find(b => b.bookingId === driver.bookingId);
        driver.bookingStatus = booking?.status; // Keep status in sync

        if (booking && driver.approved) {
          let targetPosition: Position | null = null;
          // Determine target based on booking status
          if (['requested', 'confirmed'].includes(booking.status)) targetPosition = USER_LOCATION;
          else if (['picked_up', 'in_wash', 'drying'].includes(booking.status)) targetPosition = CAR_WASH_LOCATION;
          else if (booking.status === 'done') targetPosition = USER_LOCATION;

          if (targetPosition) {
            // Fetch new route if target changes or no route exists
            if (!routePoints[driver.driverId] || newRoutes[driver.driverId]?.target !== booking.status) {
              const routeData = await getRoute(driver.position, targetPosition);
              if (routeData && routeData.coordinates) {
                routePoints[driver.driverId] = routeData.coordinates;
                routeIndices[driver.driverId] = 0;
                newRoutes[driver.driverId] = { 
                    type: 'Feature', 
                    geometry: { type: 'LineString', coordinates: routeData.coordinates },
                    target: booking.status
                };
                // Set driver to start of route
                const [longitude, latitude] = routeData.coordinates[0];
                driver.position = { longitude, latitude };
                driver.eta = routeData.duration;
              }
            }

            const currentRoute = routePoints[driver.driverId];
            const currentIndex = routeIndices[driver.driverId];

            if (currentRoute && currentIndex < currentRoute.length) {
              const [longitude, latitude] = currentRoute[currentIndex];
              driver.position = { longitude, latitude };
              routeIndices[driver.driverId]++;
              // Simple ETA decrease, could be more sophisticated
              if (driver.eta && driver.eta > 0) {
                 driver.eta -= 1; // Assuming ~1 second per animation frame
              }
            }
          }
        } else {
           // Wander randomly if no active booking and available
           if (driver.availability && driver.approved) {
                driver.position = {
                    latitude: driver.position.latitude + (Math.random() - 0.5) * 0.001,
                    longitude: driver.position.longitude + (Math.random() - 0.5) * 0.001
                };
           }
           // Clear route if no booking
           delete routePoints[driver.driverId];
           delete routeIndices[driver.driverId];
           delete newRoutes[driver.driverId];
           driver.eta = undefined;
        }
      }
      setSimDrivers(newDriverStates);
      setRoutes(newRoutes);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBookings, simDrivers, routes]); 

  const driversToDisplay = simDrivers.filter(driver => {
      // Admins can see everyone, but filter out unapproved based on context
      if (perspective === 'admin') {
          return driver.approved || !driver.approved;
      }
      // Other roles can only see approved, active drivers.
      if (!driver.approved) return false;
      
      switch (perspective) {
          case 'client': return driver.driverId === activeBooking?.driverId;
          case 'provider': 
            const booking = allBookings.find(b => b.bookingId === driver.bookingId);
            return booking && ['picked_up', 'in_wash', 'drying', 'done'].includes(booking.status);
          case 'driver': return driver.userId === user?.userId;
          default: return false;
      }
  });
  
  const getDriverColor = (driver: SimulatedDriver) => {
    if (!driver.approved) return driverStatusColors.unavailable;
    if (driver.bookingStatus) return driverStatusColors[driver.bookingStatus] || driverStatusColors.unavailable;
    return driver.availability ? driverStatusColors.available : driverStatusColors.unavailable;
  }

  if (!MAPBOX_TOKEN) {
    return (
      <Card className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <p className="font-semibold">Mapbox Access Token Missing</p>
          <p className="text-sm text-muted-foreground">Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</p>
        </div>
      </Card>
    );
  }

  const selectedBooking = allBookings.find(b => b.bookingId === selectedDriver?.bookingId);
  const selectedClient = allUsers.find(u => u.userId === selectedBooking?.clientId);
  const selectedProvider = providers.find(p => p.providerId === selectedBooking?.providerId);


  return (
    <Card className="relative w-full h-full overflow-hidden rounded-lg">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: USER_LOCATION.longitude,
          latitude: USER_LOCATION.latitude,
          zoom: 12
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={() => setSelectedDriver(null)}
      >
         {driversToDisplay.map(driver => routes[driver.driverId] && (
            <Source key={`route-${driver.driverId}`} id={`route-${driver.driverId}`} type="geojson" data={routes[driver.driverId]}>
                <Layer {...routeLayer} id={`route-layer-${driver.driverId}`} paint={{...routeLayer.paint, 'line-color': getDriverColor(driver).replace("text-", "").replace("-500", "") || '#888'}} />
            </Source>
        ))}

        <TooltipProvider>
            {driversToDisplay.map((driver) => (
            <Marker key={driver.driverId} longitude={driver.position.longitude} latitude={driver.position.latitude} anchor="bottom" onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedDriver(driver); }}>
                <Tooltip>
                    <TooltipTrigger>
                        <div className={cn("transition-colors", getDriverColor(driver))}>
                             {driver.approved ? <Car className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" /> : <ShieldAlert className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] fill-destructive" />}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-bold">{driver.user?.name || `Driver`}</p>
                        {!driver.approved ? <p className="text-destructive">Blocked</p> : 
                         driver.bookingId ? <p className="capitalize">{driver.bookingStatus?.replace("_", " ")}</p> : (driver.availability ? <p className="text-green-500">Available</p> : <p className="text-red-500">Unavailable</p>)}
                    </TooltipContent>
                </Tooltip>
            </Marker>
            ))}
        </TooltipProvider>

        {selectedDriver && (
             <Popup
                longitude={selectedDriver.position.longitude}
                latitude={selectedDriver.position.latitude}
                onClose={() => setSelectedDriver(null)}
                closeOnClick={false}
                anchor="bottom"
                offset={40}
             >
                <div className="w-64">
                    <h3 className="font-bold text-lg">{selectedDriver.name}</h3>
                    <p className={cn("font-semibold text-sm capitalize", getDriverColor(selectedDriver))}>
                        {!selectedDriver.approved ? 'Blocked' : selectedDriver.bookingStatus?.replace("_", " ") || (selectedDriver.availability ? 'Available' : 'Unavailable')}
                    </p>
                    <Separator className="my-2" />
                    { selectedBooking ? (
                        <div className="space-y-2 text-sm">
                            <p><span className="font-semibold">Client:</span> {selectedClient?.name}</p>
                            <p><span className="font-semibold">Vehicle:</span> {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}</p>
                            <p><span className="font-semibold">Plate:</span> {selectedBooking.vehicle.plate_no}</p>
                            <p><span className="font-semibold">Provider:</span> {selectedProvider?.name}</p>
                             {selectedDriver.eta && selectedDriver.eta > 0 && (
                                <p><span className="font-semibold">ETA:</span> {Math.ceil(selectedDriver.eta / 60)} minutes</p>
                             )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No active trip.</p>
                    )}
                </div>
             </Popup>
        )}

        {perspective === 'client' && 
            <Marker longitude={USER_LOCATION.longitude} latitude={USER_LOCATION.latitude} anchor="bottom">
                <div className="text-blue-500">
                    <MapPin className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] fill-currentColor" />
                </div>
            </Marker>
        }

        { (perspective === 'admin' || perspective === 'provider') &&
            <Marker longitude={CAR_WASH_LOCATION.longitude} latitude={CAR_WASH_LOCATION.latitude} anchor="bottom">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="text-purple-500">
                                <Wrench className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" fill="currentColor" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-bold">{providers[0].name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </Marker>
        }
      </Map>
    </Card>
  );
}
