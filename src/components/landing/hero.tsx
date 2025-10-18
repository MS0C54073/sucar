import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  const heroImageUrl = "https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA";

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
      <div className="container relative mx-auto px-4 md:px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]">
            Request a Pick-Up or Book a Car Wash
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)]">
            Choose between Self-Drive or Request a Driver. We'll find available options near you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/signup">Book Your First Wash</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
