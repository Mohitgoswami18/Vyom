import {Link} from "react-router-dom";
import { Sparkles} from "lucide-react";
import Vyom from "../assets/VyomLogo.png"

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-[#0A0A0A]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-blue-500 flex items-center justify-center">
                <img src={Vyom} alt="" className="rounded-md"/>
              </div>
              <span className="text-lg font-bold text-white">Vyom</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transforming how students find and land their dream internships
              with AI.
            </p>
            <div className="flex gap-3 pt-2">
              <Link
                href="#"
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-accent"
              >
                {/* <Github className="w-5 h-5" /> */}
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-accent"
              >
                {/* <Linkedin className="w-5 h-5" /> */}
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-accent"
              >
                {/* <Twitter className="w-5 h-5" /> */}
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#tech-stack"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Tech Stack
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 AI Internship Assistant. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="#"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Status
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Changelog
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
