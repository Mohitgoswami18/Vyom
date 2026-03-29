import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Search, CheckCircle, ArrowRight } from "lucide-react";

export default function Demo() {
  return (
    <section className="w-full pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl text-white md:text-5xl font-bold mb-4">
                See It In Action
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our intelligent dashboard gives you complete visibility over
                every internship opportunity and application. Filter, search,
                and track everything in one place.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Search,
                  title: "Advanced Search",
                  desc: "Filter by location, salary, skills required, and more",
                },
                {
                  icon: Filter,
                  title: "Smart Filters",
                  desc: "AI-powered filters that understand your preferences",
                },
                {
                  icon: CheckCircle,
                  title: "Apply with One Click",
                  desc: "Instantly apply to matching opportunities",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="p-3 rounded-lg bg-purple-600/10 h-fit">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button className="bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white border-0 gap-2">
              Explore Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="relative" >
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/40 to-blue-500/40 rounded-2xl blur-3xl opacity-50" />

            <Card className="border border-zinc-900/50 bg-[#141418]/80 backdrop-blur-sm overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      Internships for You
                    </h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-600/30" />
                      <div className="w-3 h-3 rounded-full bg-purple-600/30" />
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="px-2 py-1 rounded bg-purple-600/10 text-xs text-purple-500">
                      San Francisco
                    </div>
                    <div className="px-2 py-1 rounded bg-[#222228]/50 text-xs text-muted-foreground">
                      Full-time
                    </div>
                  </div>
                </div>

                {/* Internship Cards */}
                <div className="space-y-3">
                  {[
                    { company: "TechCorp", role: "AI/ML Intern", match: "98%" },
                    {
                      company: "StartupXYZ",
                      role: "Backend Intern",
                      match: "95%",
                    },
                    {
                      company: "InnovateLabs",
                      role: "Full Stack Intern",
                      match: "92%",
                    },
                  ].map((job, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-zinc-900/50 hover:border-purple-500/50 bg-[#222226]/30 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-purple-500 transition-colors">
                            {job.company}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {job.role}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-accent">
                            {job.match}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Match
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: job.match }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button className="w-full bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white border-0">
                  Apply All Matches
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
