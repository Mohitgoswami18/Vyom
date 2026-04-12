'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {signOut, useSession} from 'next-auth/react';

import VyomLogo from '@/assets/VyomLogo.png';

const Navbar = () => {
  
  const {data: session} = useSession();
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-zinc-600 ${
        scrolled
          ? "backdrop-blur-lg bg-transparent shadow-md rounded-md"
          : "bg-[#0A0A0A] py-2"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-blue-500 flex items-center justify-center overflow-hidden">
            <Image src={VyomLogo} alt="Vyom Logo" width={32} height={32} />
          </div>
          <span className="text-xl font-bold text-white pr-20">Vyom</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-white transition-colors"
          >
            Tech Stack
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="space-x-3">
              <Button
                onClick={() => signOut()}
                className="text-white bg-[#0A0A0A] hover:bg-white/20 py-1"
              >
                Sign out
              </Button>
              <Link href="/dashboard">
                <Button className="bg-linear-to-r from-[#7646F0] to-blue-500 hover:opacity-90 text-white border-0">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-3">
              <Link href="/api/auth/signin">
                <Button className="text-white bg-[#0A0A0A] hover:bg-white/20 py-1">
                  Sign In
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="bg-linear-to-r from-[#7646F0] to-blue-500 hover:opacity-90 text-white border-0">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;