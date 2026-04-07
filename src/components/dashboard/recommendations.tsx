"use client";

import { Star, Zap, ArrowRight } from "lucide-react";

const recommendations = [
  {
    id: 1,
    title: "Boost Your Profile",
    description:
      "Add 2-3 more projects to your portfolio to increase match rate by 15%",
    action: "View Guide",
    icon: Star,
    color: "from-yellow-500",
  },
  {
    id: 2,
    title: "Learn TypeScript",
    description:
      "Companies you're targeting use TypeScript heavily. Start learning to stand out.",
    action: "Find Courses",
    icon: Zap,
    color: "from-blue-500",
  },
  {
    id: 3,
    title: "Perfect Your Resume",
    description:
      "Your resume matches only 40% of top internships. Let's improve it together.",
    action: "Get Feedback",
    icon: Star,
    color: "from-accent",
  },
];

export default function Recommendations() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        AI Recommendations
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card/50 to-card/25 p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 cursor-pointer"
            >
              <div
                className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${rec.color} to-transparent opacity-10 blur-3xl transition-all duration-300 group-hover:opacity-20`}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">{rec.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                </div>

                <button className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                  {rec.action}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
