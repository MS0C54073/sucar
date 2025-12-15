
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("isFirstVisit") !== "false";
    const timer = setTimeout(() => {
        if (isFirstVisit) {
            setIsOpen(true);
            localStorage.setItem("isFirstVisit", "false");
        }
    }, 2000); // Show dialog after 2 seconds
    
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to SuCAR!</AlertDialogTitle>
          <AlertDialogDescription>
            Ready for a sparkling clean car? Create an account to easily book
            pickups, track your service, and manage your appointments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Maybe Later</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href="/signup">
                <Button>Create Account</Button>
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
