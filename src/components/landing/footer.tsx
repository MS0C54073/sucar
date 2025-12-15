
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Facebook, Mail, Phone } from "lucide-react";

// Inline SVG for WhatsApp as it's not in lucide-react
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);


export function Footer() {
  return (
    <footer className="w-full bg-card border-t">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-4">
                <Logo />
                <p className="text-muted-foreground max-w-xs">The future of car care in Lusaka. Convenient, reliable, and always on time.</p>
            </div>
            <div className="grid gap-4">
                <h4 className="font-semibold text-lg">Quick Links</h4>
                <nav className="flex flex-col gap-2">
                    <Link href="#features" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                        Features
                    </Link>
                    <Link href="#about" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                        About Us
                    </Link>
                     <Link href="#" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                        Contact
                    </Link>
                    <Link href="/login" className="text-muted-foreground hover:text-foreground" prefetch={false}>
                        Login
                    </Link>
                </nav>
            </div>
             <div className="grid gap-4">
                <h4 className="font-semibold text-lg">Connect With Us</h4>
                <div className="flex items-center gap-4">
                    <Link href="#" aria-label="Facebook" className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Facebook className="h-6 w-6" />
                    </Link>
                    <Link href="#" aria-label="WhatsApp" className="text-green-500 hover:text-green-600 transition-colors">
                        <WhatsAppIcon />
                    </Link>
                    <Link href="tel:+260974034628" aria-label="Call Us" className="text-gray-500 hover:text-primary transition-colors">
                        <Phone className="h-6 w-6" />
                    </Link>
                    <Link href="#" aria-label="Email" className="text-red-600 hover:text-red-700 transition-colors">
                        <Mail className="h-6 w-6" />
                    </Link>
                </div>
            </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
             <p>© {new Date().getFullYear()} SuCAR Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
