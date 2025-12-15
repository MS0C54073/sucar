
'use client';

import React from 'react';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    quote: "SuCAR has completely changed how I manage my car care. The pickup service is a lifesaver for my busy schedule!",
    name: "Thandiwe Banda",
    role: "Satisfied Client",
    avatar: "https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA",
  },
  {
    quote: "The real-time tracking is fantastic. I always know exactly where my car is and when to expect it back. Highly recommended!",
    name: "Chomba Mumba",
    role: "Regular User",
    avatar: "https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA",
  },
  {
    quote: "As a car wash provider, SuCAR has streamlined my bookings and brought in more customers. The driver system is brilliant!",
    name: "Memory Mwansa",
    role: "Partner Provider",
    avatar: "https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA",
  },
  {
    quote: "I love the convenience. My car gets washed while I'm at work. It's a total game-changer for me.",
    name: "Lethabo Zulu",
    role: "Happy Client",
    avatar: "https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA",
  },
];

export function AboutUs() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section id="about" className="w-full py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              What We Do
            </div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">
              Convenience, Trust, and a Sparkling Clean Car.
            </h2>
            <p className="text-muted-foreground md:text-lg">
             We help car owners find the best car washes easily within their area. We lift the burden of having to waste time driving your car to the car wash by helping clients find the best, most reliable, and trusted drivers on the platform to handle that for them.
            </p>
            <p className="text-muted-foreground md:text-lg">
             Our mission is to ensure your car gets back to you in the best condition, without the hassle. By connecting car owners with a network of vetted drivers and top-rated car wash providers, we've created a seamless ecosystem powered by technology, giving you back your time and peace of mind.
            </p>
          </div>
          <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA"
              alt="The SuCAR Team"
              fill
              className="object-cover"
              data-ai-hint="happy team"
            />
          </div>
        </div>

        <div className="mt-24">
            <h3 className="text-2xl font-bold text-center mb-12">What Our Customers Say</h3>
            <Carousel
              plugins={[plugin.current]}
              className="w-full max-w-4xl mx-auto"
              opts={{
                loop: true,
              }}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <div className="p-1 h-full">
                      <div className="bg-card p-6 rounded-lg shadow-sm h-full flex flex-col justify-between">
                          <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                          <div className="flex items-center gap-4 mt-auto">
                              <Avatar>
                                  <AvatarImage src={testimonial.avatar} alt={testimonial.name}/>
                                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="font-semibold">{testimonial.name}</p>
                                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                              </div>
                          </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </div>
      </div>
    </section>
  );
}
