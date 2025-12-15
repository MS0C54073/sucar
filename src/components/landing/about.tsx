import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
];

export function AboutUs() {
  return (
    <section id="about" className="w-full py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              About SuCAR
            </div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">
              Driven by a Passion for Pristine Cars
            </h2>
            <p className="text-muted-foreground md:text-lg">
              SuCAR was founded with a simple mission: to make car care convenient, transparent, and trustworthy for everyone in Lusaka. We saw the hassle of traditional car washes—the long waits, the uncertain quality, and the time taken out of a busy day. We knew there had to be a better way.
            </p>
            <p className="text-muted-foreground md:text-lg">
              By connecting car owners with a network of reliable drivers and top-rated car wash providers, we've created a seamless ecosystem powered by technology. Our platform isn't just about cleaning cars; it's about giving you back your time and peace of mind.
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
            <div className="grid md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-card p-6 rounded-lg shadow-sm">
                        <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={testimonial.avatar} />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
