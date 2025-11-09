
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Car, MapPin } from "lucide-react";
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

// Define key locations on the map as percentages
const USER_LOCATION = { top: 50, left: 50 };
const CAR_WASH_LOCATION = { top: 20, left: 80 };

// Pre-defined initial positions for drivers
const initialDriverPositions = [
  { top: 35, left: 55 },
  { top: 60, left: 40 },
  { top: 25, left: 30 },
  { top: 75, left: 70 },
];

interface Position {
  top: number;
  left: number;
}

interface SimulatedDriver extends Driver {
  position: Position;
  user: typeof MOCK_USERS[0] | undefined;
}

// Function to interpolate between two points
const interpolate = (start: Position, end: Position, factor: number) => {
  return {
    top: start.top + (end.top - start.top) * factor,
    left: start.left + (end.left - start.left) * factor,
  };
};

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
    const driversToSimulate = MOCK_DRIVERS
      .filter(d => d.approved)
      .slice(0, initialDriverPositions.length)
      .map((driver, index) => ({
        ...driver,
        position: initialDriverPositions[index % initialDriverPositions.length],
        user: MOCK_USERS.find((u) => u.userId === driver.userId),
      }));

    if (activeBooking) {
      const assigned = driversToSimulate[1]; // Assign the second driver for demo
      setAssignedDriver(assigned);
      setSimulatedDrivers(driversToSimulate.filter(d => d.driverId !== assigned.driverId));
    } else {
      setSimulatedDrivers(driversToSimulate);
    }
  }, [user, activeBooking]);


  // Simulation loop for driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      // Animate assigned driver based on booking status
      if (assignedDriver && currentStatus) {
        setAssignedDriver(prevDriver => {
          if (!prevDriver) return null;

          let targetPosition = prevDriver.position;
          let speed = 0.05; // Represents 5% of the distance per interval

          switch (currentStatus) {
            case 'requested':
            case 'confirmed':
                 // Driver moves towards user for pickup
                 targetPosition = USER_LOCATION;
                 break;
            case 'picked_up':
            case 'in_wash':
                // Driver moves towards car wash
                targetPosition = CAR_WASH_LOCATION;
                break;
            case 'drying':
            case 'done':
                // Driver moves back to user for delivery
                targetPosition = USER_LOCATION;
                break;
            case 'delivered':
                // Stays at user location
                targetPosition = USER_LOCATION;
                break;
          }
          
          // If close enough, snap to target
          const distance = Math.sqrt(Math.pow(targetPosition.top - prevDriver.position.top, 2) + Math.pow(targetPosition.left - prevDriver.position.left, 2));
          if (distance < 1) {
              return {...prevDriver, position: targetPosition};
          }

          return {
            ...prevDriver,
            position: interpolate(prevDriver.position, targetPosition, speed),
          };
        });
      }

      // Animate other drivers randomly
      setSimulatedDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          const newTop = driver.position.top + (Math.random() - 0.5) * 2;
          const newLeft = driver.position.left + (Math.random() - 0.5) * 2;
          const newAvailability = Math.random() > 0.1;

          return {
            ...driver,
            availability: newAvailability,
            position: {
              top: Math.max(10, Math.min(90, newTop)),
              left: Math.max(10, Math.min(90, newLeft)),
            },
          };
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [assignedDriver, currentStatus]);

  const allDrivers = assignedDriver ? [...simulatedDrivers, assignedDriver] : simulatedDrivers;

  return (
    <Card className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
      <Image
        src="https://picsum.photos/seed/lusaka-map-2/1200/800"
        alt="A Google Maps style satellite view of Lusaka showing nearby drivers"
        fill
        className="object-cover"
        data-ai-hint="satellite map"
      />
      <div className="absolute inset-0 bg-black/10" />

      <TooltipProvider>
        {allDrivers.map((driver) => (
          <Tooltip key={driver.driverId}>
            <TooltipTrigger asChild>
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
                style={{ top: `${driver.position.top}%`, left: `${driver.position.left}%` }}
              >
                <div className={cn(
                    "transition-colors",
                    driver.driverId === assignedDriver?.driverId ? "text-amber-400" : (driver.availability ? "text-primary" : "text-muted-foreground")
                  )}>
                    <Car className="h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{driver.user?.name || `Driver`}</p>
              <p>{driver.driverId === assignedDriver?.driverId ? "On your trip" : (driver.availability ? "Available" : "Unavailable")}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      {/* User's location pin */}
      <div
        className="absolute text-blue-500 transform -translate-x-1/2 -translate-y-1/2"
        style={{ top: `${USER_LOCATION.top}%`, left: `${USER_LOCATION.left}%` }}
      >
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-blue-500/20 animate-ping"></div>
          <MapPin className="relative h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" fill="currentColor" />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full absolute inset-0"></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your Location</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

       {/* Car Wash Location Pin */}
      <div
        className="absolute text-purple-500 transform -translate-x-1/2 -translate-y-1/2"
        style={{ top: `${CAR_WASH_LOCATION.top}%`, left: `${CAR_WASH_LOCATION.left}%` }}
      >
        <div className="relative">
          <Wrench className="relative h-8 w-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" fill="currentColor" />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full absolute inset-0"></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>SparkleClean Wash</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
