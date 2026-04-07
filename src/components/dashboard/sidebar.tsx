"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-border/50 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-blue-500" />
          <span className="font-semibold text-foreground">InternAI</span>
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
                  ? "bg-gradient-to-r from-accent/20 to-blue-500/20 text-accent shadow-lg shadow-accent/20"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-card/50 backdrop-blur-xl p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary/50 hover:text-foreground">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
