"use client";

import  Sidebar  from "../dashboard/sidebar";
import  AIChat  from "../dashboard/ai-chat";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen ">
      <Sidebar />
      <main className="ml-64 min-h-screen bg-[#0A0A0A]  p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <AIChat />
    </div>
  );
}
