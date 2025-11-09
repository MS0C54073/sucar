
"use client";

import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { Card } from "@/components/ui/card";
import { Car, MapPin, Wrench } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MOCK_DRIVERS, MOCK_USERS } from "@/lib/mock-data";
import type { Driver, Booking } from "@/lib/types";
import { useAuth } from "@/context/auth-provider";
import { useBooking } from "@/context/booking-provider";

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

async function getRoute(start: Position, end: Position) {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  const data = json.routes[0];
  return data.geometry.coordinates;
}


export function MapView({ activeBooking }: { activeBooking?: Booking }) {
  const { user } = useAuth();
  const { drivers } = useBooking();
  const [simulatedDrivers, setSimulatedDrivers] = useState<SimulatedDriver[]>([]);
  const [assignedDriver, setAssignedDriver] = useState<SimulatedDriver | null>(null);
  const [route, setRoute] = useState<any>(null);
  const mapRef = useRef<MapRef>(null);

  // Initialize drivers
  useEffect(() => {
    const allApprovedDrivers = drivers
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
      if (assigned) {
        mapRef.current?.flyTo({ center: [assigned.position.longitude, assigned.position.latitude], zoom: 14 });
      }
    } else {
      setAssignedDriver(null);
      setSimulatedDrivers(allApprovedDrivers);
      setRoute(null);
    }
  }, [user, activeBooking, drivers]);


  // Simulation loop for driver movement and route fetching
  useEffect(() => {
    if (!activeBooking || !assignedDriver) {
      setRoute(null);
      return;
    };

    let animationFrameId: number;
    let routePoints: number[][] | null = null;
    let routeIndex = 0;

    const animate = async () => {
      const currentStatus = activeBooking.status;
      let targetPosition: Position | null = null;

      switch (currentStatus) {
        case 'requested':
        case 'confirmed':
             targetPosition = USER_LOCATION;
             break;
        case 'picked_up':
        case 'in_wash':
        case 'drying':
            targetPosition = CAR_WASH_LOCATION;
            break;
        case 'done':
            targetPosition = USER_LOCATION;
            break;
      }
      
      if (targetPosition) {
        // Fetch route if it's not available or target has changed
        if (!routePoints) {
            routePoints = await getRoute(assignedDriver.position, targetPosition);
            if (routePoints) {
                routeIndex = 0;
                const routeGeoJSON = {
                    type: 'Feature' as const,
                    properties: {},
                    geometry: {
                        type: 'LineString' as const,
                        coordinates: routePoints
                    }
                };
                setRoute(routeGeoJSON);
            }
        }
        
        // Move driver along the route
        if (routePoints && routeIndex < routePoints.length) {
            const [longitude, latitude] = routePoints[routeIndex];
            setAssignedDriver(prev => prev ? {...prev, position: { longitude, latitude }} : null);
            routeIndex++;
        }
      }
      
      // Animate other drivers randomly
      setSimulatedDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          if (driver.availability) {
            const newLat = driver.position.latitude + (Math.random() - 0.5) * 0.001;
            const newLon = driver.position.longitude + (Math.random() - 0.5) * 0.001;
            return {
              ...driver,
              position: {
                latitude: Math.max(-15.5, Math.min(-15.3, newLat)),
                longitude: Math.max(28.2, Math.min(28.4, newLon)),
              },
            };
          }
          return driver;
        })
      );
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [assignedDriver, activeBooking]);

  const allDriversToDisplay = assignedDriver ? [...simulatedDrivers, assignedDriver] : simulatedDrivers;

  if (!MAPBOX_TOKEN) {
    return (
      <Card className="flex items-center justify-center w-full h-[400px] lg:h-[500px]">
        <div className="text-center">
          <p className="font-semibold">Mapbox Access Token Missing</p>
          <p className="text-sm text-muted-foreground">Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: USER_LOCATION.longitude,
          latitude: USER_LOCATION.latitude,
          zoom: 12
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {route && (
            <Source id="route" type="geojson" data={route}>
                <Layer {...routeLayer} />
            </Source>
        )}
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
