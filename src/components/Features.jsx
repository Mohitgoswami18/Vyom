import {
  Zap,
  Target,
  BarChart3,
  Wand2,
  Brain,
  CheckCircle2,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Target,
    title: "Personalized Recommendations",
    description:
      "AI analyzes your skills and preferences to recommend internships that truly match your career goals",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Zap,
    title: "Real-time Listings",
    description:
      "Access 50,000+ internships from Internshala, Wellfound, LinkedIn, and other major platforms in real-time",
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: BarChart3,
    title: "Smart Resume Matching",
    description:
      "Our AI engine matches your resume with job descriptions to maximize your application success rate",
    color: "from-pink-400 to-rose-400",
  },
  {
    icon: Wand2,
    title: "Auto-Application Assistant",
    description:
      "Intelligently fill out application forms with your information and submit applications instantly",
    color: "from-yellow-400 to-orange-400",
  },
  {
    icon: Brain,
    title: "AI Chat Assistant",
    description:
      "Get 24/7 guidance on resume building, interview prep, and career development from our AI mentor",
    color: "from-green-400 to-emerald-400",
  },
  {
    icon: CheckCircle2,
    title: "Application Tracker",
    description:
      "Monitor all your applications, track statuses, and get AI-powered follow-up reminders",
    color: "from-indigo-400 to-blue-500",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="w-full relative pb-20 md:py-32 bg-linear-to-b from-transparent via-accent/5 to-transparent"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Powerful Features,
            <span className="block text-gradient bg-linear-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
              Infinite Possibilities
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to land your dream internship, powered by
            cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card
                key={i}
                className="relative group overflow-hidden border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 bg-[#141418]/30 backdrop-blur-sm hover:bg-white/10"
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-linear-to-br ${feature.color} transition-opacity duration-300 -z-10`}
                />

                <div className="p-8 space-y-4">
                  <div
                    className={`inline-flex p-3 group-hover:scale-120 group-hover:rotate-10 group-hover:translate-[-3] transition-all duration-200 rounded-lg bg-linear-to-br ${feature.color}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
