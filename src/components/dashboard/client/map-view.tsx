
"use client";

import React, { useState, useEffect } from "react";
import Map, { Marker } from 'react-map-gl';
import { Card } from "@/components/ui/card";
import { Car, MapPin, Wrench } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MOCK_DRIVERS, MOCK_USERS, MOCK_BOOKINGS } from "@/lib/mock-data";
import type { Driver, BookingStatus as BookingStatusType } from "@/lib/types";
import { useAuth } from "@/context/auth-provider";

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
  user: typeof MOCK_USERS[0] | undefined;
}

// Function to interpolate between two points
const interpolate = (start: Position, end: Position, factor: number): Position => {
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * factor,
    longitude: start.longitude + (end.longitude - start.longitude) * factor,
  };
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function MapView({ currentStatus }: { currentStatus?: BookingStatusType }) {
  const { user } = useAuth();
  const [simulatedDrivers, setSimulatedDrivers] = useState<SimulatedDriver[]>([]);
  const [assignedDriver, setAssignedDriver] = useState<SimulatedDriver | null>(null);

  // Find the active booking for the current user
  const activeBooking = MOCK_BOOKINGS.find(
    (b) =>
      b.clientId === user?.userId &&
      b.status !== "delivered" &&
      b.status !== "cancelled"
  );

  // Initialize drivers
  useEffect(() => {
    const allApprovedDrivers = MOCK_DRIVERS
      .filter(d => d.approved)
      .map((driver) => ({
        ...driver,
        position: initialDriverPositions[driver.driverId] || { latitude: -15.4167 + (Math.random() - 0.5) * 0.1, longitude: 28.2814 + (Math.random() - 0.5) * 0.1 },
        user: MOCK_USERS.find((u) => u.userId === driver.userId),
      }));

    if (activeBooking) {
      const assigned = allApprovedDrivers.find(d => d.driverId === activeBooking.driverId) || null;
      setAssignedDriver(assigned);
      setSimulatedDrivers(allApprovedDrivers.filter(d => d.driverId !== activeBooking.driverId));
    } else {
      setAssignedDriver(null);
      setSimulatedDrivers(allApprovedDrivers);
    }
  }, [user, activeBooking]);


  // Simulation loop for driver movement
  useEffect(() => {
    if (!activeBooking) return;

    const interval = setInterval(() => {
      if (assignedDriver && currentStatus) {
        setAssignedDriver(prevDriver => {
          if (!prevDriver) return null;

          let targetPosition = prevDriver.position;
          let speed = 0.05;

          switch (currentStatus) {
            case 'requested':
            case 'confirmed':
                 targetPosition = USER_LOCATION;
                 break;
            case 'picked_up':
            case 'in_wash':
                targetPosition = CAR_WASH_LOCATION;
                break;
            case 'drying':
            case 'done':
                targetPosition = USER_LOCATION;
                break;
            case 'delivered':
                targetPosition = USER_LOCATION;
                break;
          }
          
          const distance = Math.sqrt(Math.pow(targetPosition.latitude - prevDriver.position.latitude, 2) + Math.pow(targetPosition.longitude - prevDriver.position.longitude, 2));
          if (distance < 0.0001) {
              return {...prevDriver, position: targetPosition};
          }

          return {
            ...prevDriver,
            position: interpolate(prevDriver.position, targetPosition, speed),
          };
        });
      }

      setSimulatedDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          const newLat = driver.position.latitude + (Math.random() - 0.5) * 0.005;
          const newLon = driver.position.longitude + (Math.random() - 0.5) * 0.005;
          
          return {
            ...driver,
            position: {
              latitude: Math.max(-15.5, Math.min(-15.3, newLat)),
              longitude: Math.max(28.2, Math.min(28.4, newLon)),
            },
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [assignedDriver, currentStatus, activeBooking]);

  const allDriversToDisplay = assignedDriver ? [...simulatedDrivers, assignedDriver] : simulatedDrivers;

  if (!MAPBOX_TOKEN) {
    return (
      <Card className="flex items-center justify-center w-full h-[400px] lg:h-[500px]">
        <div className="text-center">
          <p className="font-semibold">Mapbox Access Token Missing</p>
          <p className="text-sm text-muted-foreground">Please add your token to the .env file.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
      <Map
        initialViewState={{
          longitude: USER_LOCATION.longitude,
          latitude: USER_LOCATION.latitude,
          zoom: 12
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <TooltipProvider>
            {allDriversToDisplay.map((driver) => (
            <Marker key={driver.driverId} longitude={driver.position.longitude} latitude={driver.position.latitude} anchor="bottom">
                <Tooltip>
                    <TooltipTrigger>
                        <div className={cn(
                            "transition-colors",
                            driver.driverId === assignedDriver?.driverId ? "text-amber-400" : (driver.availability ? "text-primary" : "text-muted-foreground")
                        )}>
                            <Car className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-bold">{driver.user?.name || `Driver`}</p>
                        <p>{driver.driverId === assignedDriver?.driverId ? "On your trip" : (driver.availability ? "Available" : "Unavailable")}</p>
                    </TooltipContent>
                </Tooltip>
            </Marker>
            ))}
        </TooltipProvider>

        <Marker longitude={USER_LOCATION.longitude} latitude={USER_LOCATION.latitude} anchor="bottom">
            <div className="text-blue-500">
                <MapPin className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" fill="currentColor" />
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <div className="w-full h-full absolute inset-0 cursor-pointer"></div>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Your Location</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Marker>

        <Marker longitude={CAR_WASH_LOCATION.longitude} latitude={CAR_WASH_LOCATION.latitude} anchor="bottom">
            <div className="text-purple-500">
                <Wrench className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" fill="currentColor" />
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                     <div className="w-full h-full absolute inset-0 cursor-pointer"></div>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>SparkleClean Wash</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Marker>
      </Map>
    </Card>
  );
}
