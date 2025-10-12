import {
  Smartphone,
  MapPin,
  ShieldCheck,
  User,
  Car,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <Smartphone className="h-10 w-10 text-primary" />,
    title: "Easy Booking",
    description: "Book a car wash in seconds from our user-friendly app.",
  },
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    title: "Real-Time Tracking",
    description:
      "Track your car's journey from pickup to drop-off in real time.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Secure Payments",
    description: "Pay securely online with multiple payment options.",
  },
  {
    icon: <User className="h-10 w-10 text-primary" />,
    title: "For Everyone",
    description:
      "Tailored dashboards for clients, drivers, and service providers.",
  },
  {
    icon: <Car className="h-10 w-10 text-primary" />,
    title: "AI-Optimized Routes",
    description: "Our drivers use AI to find the fastest, most efficient routes.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Quality Service",
    description: "Partnering with top-rated car washes for a pristine clean.",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Key Features
            </div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">
              Everything You Need for Effortless Car Care
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From seamless booking to real-time tracking and management, SuCAR
              provides a complete solution for modern car washing needs.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="grid gap-4 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
