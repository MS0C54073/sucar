import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-xl font-bold font-headline",
        className
      )}
    >
      <div className="relative">
        <Sparkles className="h-7 w-7 text-primary" />
      </div>
      <span>SuCAR</span>
    </div>
  );
}
