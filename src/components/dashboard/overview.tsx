"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Zap, CheckCircle2, Clock } from "lucide-react";
import  Recommendations  from "../dashboard/recommendations";
import { toast } from "sonner";

const applicationData = [
  { month: "Jan", applications: 4, matches: 2 },
  { month: "Feb", applications: 8, matches: 5 },
  { month: "Mar", applications: 12, matches: 8 },
  { month: "Apr", applications: 15, matches: 11 },
];

const recentApplications = [
  {
    id: 1,
    company: "Google",
    position: "Software Engineer Intern",
    status: "pending",
    date: "2 days ago",
  },
  {
    id: 2,
    company: "Meta",
    position: "Product Manager Intern",
    status: "accepted",
    date: "1 week ago",
  },
  {
    id: 3,
    company: "Netflix",
    position: "Data Science Intern",
    status: "pending",
    date: "3 days ago",
  },
  {
    id: 4,
    company: "Microsoft",
    position: "Cloud Engineer Intern",
    status: "rejected",
    date: "1 week ago",
  },
];

export function Overview() {
  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, Alex!</h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s your internship journey at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4 ">
        {[
          {
            label: "Applications Sent",
            value: "39",
            icon: TrendingUp,
            color: "from-accent",
          },
          {
            label: "AI Matches Found",
            value: "24",
            icon: Zap,
            color: "from-blue-500",
          },
          {
            label: "Accepted",
            value: "3",
            icon: CheckCircle2,
            color: "from-green-500",
          },
          {
            label: "Pending",
            value: "12",
            icon: Clock,
            color: "from-yellow-500",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-[#101311] p-6 backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-${stat.color}/20`}
            >
              <div
                className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-linear-to-br ${stat.color} to-transparent opacity-10 blur-3xl transition-all duration-300 group-hover:opacity-20`}
              />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-4xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
                <Icon
                  className={`h-6 w-6 text-muted-foreground transition-colors duration-200 group-hover:text-accent`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Applications Chart */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#101311] p-6 backdrop-blur-xl">
          <h3 className="mb-6 text-lg font-semibold text-white">
            Application Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis stroke="#a3a3a3" />
              <YAxis stroke="#a3a3a3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="applications"
                fill="#7c3aed"
                radius={[8, 8, 0, 0]}
              />
              <Bar dataKey="matches" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Match Score Chart */}
        <div className="rounded-xl border border-zinc-800/50 bg-[#101311] p-6 backdrop-blur-xl">
          <h3 className="mb-6 text-lg font-semibold text-white">
            AI Match Score
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis stroke="#a3a3a3" />
              <YAxis stroke="#a3a3a3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="matches"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: "#06b6d4" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="rounded-xl border border-zinc-800/50 bg-[#0F0F0F] p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-semibold text-white">
          Recent Applications
        </h3>
        <div className="space-y-3">
          {recentApplications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between rounded-lg border border-zinc-900/30 bg-[#1D1D1D] p-4 hover:bg-white/10"
            >
              <div>
                <p className="font-medium text-white">{app.company}</p>
                <p className="text-sm text-muted-foreground">{app.position}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  {app.date}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    app.status === "accepted"
                      ? "bg-green-500/20 text-green-400"
                      : app.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <Recommendations />
    </div>
  );
}
