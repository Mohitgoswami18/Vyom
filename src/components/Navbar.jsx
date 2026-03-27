import VyomLogo from "../assets/VyomLogo.png";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full bg-[#0A0A0A] border-b border-zinc-600 backdrop-blur-md" fixed top-0 left-0 right-0 z-50 transition-all duration-200  ${
        scrolled
          ? "backdrop-blur-lg shadow-md bg-transparent rounded-md"
          : "py-2"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-blue-500 flex items-center justify-center">
            <img src={VyomLogo} alt="" />
          </div>
          <span className="text-xl font-bold text-white pr-20">Vyom</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href=""
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href=""
            className="text-muted-foreground hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link
            href=""
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Tech Stack
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button className="text-white bg-[#0A0A0A] hover:bg-white/20 py-1">
            Sign In
          </Button>
          <Button className="bg-linear-to-r from-[#7646F0] to-blue-500 hover:opacity-90 text-white border-0">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
}
