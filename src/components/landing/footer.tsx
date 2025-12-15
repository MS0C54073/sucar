
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Facebook, Mail, Phone, Linkedin } from "lucide-react";

// Inline SVG for WhatsApp as it's not in lucide-react
const WhatsAppIcon = () => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="currentColor"
    >
      <path d="M12.06 0C5.4 0 0 5.4 0 12.06c0 3.48 1.5 6.6 3.96 8.76L0 24l3.3-3.84c2.04 1.56 4.5 2.4 7.08 2.4 6.66 0 12.06-5.4 12.06-12.06S18.72 0 12.06 0zm0 2.16c5.46 0 9.9 4.44 9.9 9.9 0 2.64-1.08 5.04-2.88 6.78l.12.12-1.92 2.16 2.22-2.28a9.72 9.72 0 0 1-7.44 3.12c-5.46 0-9.9-4.44-9.9-9.9s4.44-9.9 9.9-9.9zm0 1.5c-4.62 0-8.4 3.78-8.4 8.4 0 2.28 1.02 4.38 2.64 5.82l.12.12-1.32 1.56 1.5-.42.3.18c1.38.84 3 1.32 4.68 1.32 4.62 0 8.4-3.78 8.4-8.4s-3.78-8.4-8.4-8.4zm4.26 10.44c-.24.54-.9.9-1.26 1.02-.3.12-.72.12-.96.06-1.08-.24-2.16-.78-3.06-1.56l-.12-.12c-1.2-.96-2.16-2.16-2.82-3.48-.12-.3-.06-.6.06-.84.24-.36.6-.84.78-.96.12-.06.24-.06.36 0l.3.12s.36.36.54.6c.12.18.18.36.18.54 0 .12-.06.24-.06.3l-.24.3c-.12.12-.12.24-.06.36.06.18.42.72.96 1.2.6.48 1.08.72 1.26.78.18.06.3.06.42-.06.18-.12.42-.48.6-.72.12-.18.24-.3.42-.3.12 0 .6.3.72.36.18.06.3.12.36.18.12.12.12.24.06.42z" />
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
                    <Link href="#" aria-label="LinkedIn" className="text-blue-700 hover:text-blue-800 transition-colors">
                        <Linkedin className="h-6 w-6" />
                    </Link>
                    <Link href="https://wa.me/260974034628" aria-label="WhatsApp" className="text-green-500 hover:text-green-600 transition-colors" target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon />
                    </Link>
                    <Link href="tel:+260974034628" aria-label="Call Us" className="text-gray-500 hover:text-primary transition-colors">
                        <Phone className="h-6 w-6" />
                    </Link>
                    <Link href="mailto:info@sucar.app" aria-label="Email" className="text-red-600 hover:text-red-700 transition-colors">
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
