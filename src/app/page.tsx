import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AboutUs } from "@/components/landing/about";
import { Footer } from "@/components/landing/footer";
import { WelcomeDialog } from "@/components/landing/welcome-dialog";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <AboutUs />
      </main>
      <Footer />
      <WelcomeDialog />
    </div>
  );
}
