"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import vyomLogo from "@/assets/VyomLogo.png";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  {
    label: "Find Internships",
    href: "/dashboard/internships",
    icon: Briefcase,
  },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bg-[#121212] left-0 top-0 h-screen w-64 border-r border-zinc-800/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-zinc-800/60 px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src={vyomLogo} alt="Vyom Logo" width={32} height={32} />
          <span className="font-semibold text-white">Vyom</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-linear-to-r from-purple-500/20 to-blue-500/20 text-accent shadow-sm shadow-purple-800"
                  : "text-muted-foreground hover:bg-zinc-900/60 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800/50 bg-[#121212] backdrop-blur-xl p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-zinc-900/70 hover:text-white">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
