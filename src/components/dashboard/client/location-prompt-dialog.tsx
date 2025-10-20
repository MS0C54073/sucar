
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationPromptDialogProps {
  onLocationSet: () => void;
}

export function LocationPromptDialog({ onLocationSet }: LocationPromptDialogProps) {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Confirm Your Location
          </AlertDialogTitle>
          <AlertDialogDescription>
            To find the nearest drivers and services, we need your location. For
            this prototype, we will set your location to a default spot in
            Lusaka, Zambia.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={onLocationSet}>Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
