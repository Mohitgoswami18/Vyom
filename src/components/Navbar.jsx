import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">AI Internship</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#tech-stack"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Tech Stack
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-foreground hover:bg-secondary"
          >
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-accent to-blue-500 hover:opacity-90 text-white border-0">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
}
