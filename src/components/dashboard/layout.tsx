"use client";

import  Sidebar  from "../dashboard/sidebar";
import  AIChat  from "../dashboard/ai-chat";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen bg-linear-to-b from-background via-background to-background/50 p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <AIChat />
    </div>
  );
}
