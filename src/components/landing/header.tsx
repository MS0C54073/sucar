
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link
              href="#features"
              className="transition-colors hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="transition-colors hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="transition-colors hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
