"use client";

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
import React from "react";
import { MOCK_DRIVERS, MOCK_USERS } from "@/lib/mock-data";

// Pre-defined positions for drivers on the Lusaka map
const driverPositions = [
  { top: "35%", left: "55%" }, // East of center
  { top: "60%", left: "40%" }, // South-west of center
  { top: "25%", left: "30%" }, // North-west
  { top: "75%", left: "70%" }, // South-east
  { top: "50%", left: "65%" }, // Central-east
];

export function MapView() {
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
        {MOCK_DRIVERS.slice(0, driverPositions.length).map((driver, index) => {
          const user = MOCK_USERS.find(u => u.userId === driver.userId);
          return (
            <Tooltip key={driver.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
                    driver.availability
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  style={driverPositions[index]}
                >
                  <MapPin className="h-8 w-8 drop-shadow-lg" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{user?.name || `Driver #${driver.id.slice(-4)}`}</p>
                <p>{driver.availability ? "Available" : "Unavailable"}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
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
                <TooltipTrigger asChild><div className="w-full h-full absolute inset-0"></div></TooltipTrigger>
                <TooltipContent>
                    <p>Your Location</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
