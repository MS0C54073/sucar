import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  const heroImageUrl = "https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA";

  return (
    <section className="relative w-full bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[60vh] py-20">
          <div className="text-white text-center lg:text-left">
            <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
              Request a Pick-Up or Book a Car Wash
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]">
              Choose between Self-Drive or Request a Driver. We'll find available options near you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/signup">Book Your First Wash</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-black hover:bg-white/90">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-64 lg:h-auto lg:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
                alt="A shiny clean car in a modern setting"
                fill
                className="object-cover"
                priority
                data-ai-hint="clean car"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
