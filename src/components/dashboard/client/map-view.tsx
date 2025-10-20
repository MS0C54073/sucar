
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MOCK_DRIVERS, MOCK_USERS } from "@/lib/mock-data";
import type { Driver } from "@/lib/types";

// Pre-defined initial positions for drivers on the Lusaka map
const initialDriverPositions = [
  { top: "35%", left: "55%" }, // East of center
  { top: "60%", left: "40%" }, // South-west of center
  { top: "25%", left: "30%" }, // North-west
  { top: "75%", left: "70%" }, // South-east
  { top: "50%", left: "65%" }, // Central-east
];

interface Position {
  top: string;
  left: string;
}

interface SimulatedDriver extends Driver {
  position: Position;
  user: typeof MOCK_USERS[0] | undefined;
}

export function MapView() {
  const [simulatedDrivers, setSimulatedDrivers] = useState<SimulatedDriver[]>([]);

  useEffect(() => {
    // Initialize drivers with positions and user data
    const driversToSimulate = MOCK_DRIVERS
      .slice(0, initialDriverPositions.length)
      .map((driver, index) => ({
        ...driver,
        position: initialDriverPositions[index],
        user: MOCK_USERS.find((u) => u.userId === driver.userId),
      }));
    setSimulatedDrivers(driversToSimulate);
  }, []);

  useEffect(() => {
    // This interval simulates driver movement and availability changes
    const interval = setInterval(() => {
      setSimulatedDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          // Simulate small random movements
          const topNum = parseFloat(driver.position.top);
          const leftNum = parseFloat(driver.position.left);
          const newTop = topNum + (Math.random() - 0.5) * 2; // Move up/down by max 1%
          const newLeft = leftNum + (Math.random() - 0.5) * 2; // Move left/right by max 1%

          // Simulate random availability change
          const newAvailability = Math.random() > 0.1 ? true : false; // 10% chance to become unavailable

          return {
            ...driver,
            position: {
              top: `${Math.max(10, Math.min(90, newTop))}%`, // Keep pins within map bounds
              left: `${Math.max(10, Math.min(90, newLeft))}%`,
            },
            availability: newAvailability,
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative w-full h-[400px] overflow-hidden">
      <Image
        src="https://picsum.photos/seed/lusaka-map/1200/800"
        alt="Map of Lusaka showing nearby drivers"
        fill
        className="object-cover"
        data-ai-hint="Lusaka street map"
      />
      <div className="absolute inset-0 bg-black/10" />

      <TooltipProvider>
        {simulatedDrivers.map((driver, index) => (
          <Tooltip key={driver.id}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear",
                  driver.availability
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                style={driver.position}
              >
                <MapPin className="h-8 w-8 drop-shadow-lg" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{driver.user?.name || `Driver #${driver.id.slice(-4)}`}</p>
              <p>{driver.availability ? "Available" : "Unavailable"}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      {/* User's location pin (central Lusaka) */}
      <div
        className="absolute text-blue-500"
        style={{ top: "50%", left: "50%" }}
      >
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-blue-500/20 animate-ping"></div>
          <MapPin className="relative h-8 w-8" fill="currentColor" />
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
    </Card>
  );
}
