import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-grid-pattern w-full min-h-screen pt-32 pb-2 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-400/20 blur-[120px] animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-blue-400/20 blur-[120px] animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-accent/10 blur-[150px] animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-accent/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 -left-96 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-96 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center space-y-8">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6F34D3] bg-[#0A0A0A]/5 backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-[#6F34D3] animate-pulse" />
            <span className="text-sm text-[#6F34D3]">
              Powered by Advanced AI
            </span>
          </div>

          {/* Main heading with gradient */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="text-white">Find Internships</span>
            <br />
            <span className="bg-linear-to-r from-accent via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Smarter with AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Let AI do the heavy lifting. Our intelligent agent automatically
            finds relevant internships, matches your skills, and applies on your
            behalf—while you focus on other opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-black font-semibold px-8 rounded-full"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#6F34D3]/50 bg-black hover:bg-[#6F34D3]/10 hover:text-white text-white px-8 rounded-full gap-2"
            >
              <Play className="w-4 h-4" />
              View Demo
            </Button>
          </div>

          {/* Stats or social proof */}
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl text-white">500+</div>
              <div className="text-muted-foreground">Students Helped</div>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="font-bold text-2xl text-white">5,000+</div>
              <div className="text-muted-foreground">Internships Applied</div>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="font-bold text-2xl text-white">92%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
