"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { mockDrivers } from "@/lib/placeholder-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

// Function to generate random positions for drivers on the map
const getRandomPosition = () => ({
  top: `${Math.random() * 85 + 5}%`, // 5% to 90%
  left: `${Math.random() * 90 + 5}%`, // 5% to 95%
});

export function MapView() {
    const [driverPositions] = React.useState(mockDrivers.map(getRandomPosition));

  return (
    <Card className="relative w-full h-[400px] overflow-hidden">
      <Image
        src="https://picsum.photos/seed/map/1200/800"
        alt="Map of nearby drivers"
        fill
        className="object-cover"
        data-ai-hint="street map"
      />
      <div className="absolute inset-0 bg-black/10" />

      <TooltipProvider>
        {mockDrivers.map((driver, index) => (
          <Tooltip key={driver.driverId}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
                  driver.availability ? "text-primary" : "text-muted-foreground"
                )}
                style={driverPositions[index]}
              >
                <MapPin className="h-8 w-8 drop-shadow-lg" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{driver.name}</p>
              <p>{driver.availability ? "Available" : "Unavailable"}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      {/* User's location pin */}
      <div
        className="absolute text-blue-500"
        style={{ top: "50%", left: "50%" }}
      >
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-blue-500/20 animate-ping"></div>
          <MapPin className="relative h-8 w-8" fill="currentColor" />
        </div>
      </div>
    </Card>
  );
}
