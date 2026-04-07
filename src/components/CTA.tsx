'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="w-full py-20 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 via-transparent to-blue-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <Card className="relative border border-purple-600/30 bg-linear-to-br from-[#141418] to-[#141418] backdrop-blur-sm overflow-hidden p-12 md:p-16">
          {/* linear accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-600 to-transparent" />

          <div className="text-center space-y-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-600/30 bg-purple-600/5">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">
                Limited Time Offer
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-6xl font-bold">
              <span className="block text-white mb-2">Ready to Transform</span>
              <span className="bg-linear-to-r from-purple-600 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Your Internship Journey?
              </span>
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Join hundreds of students who&apos;ve landed their dream
              internships with AI Internship Assistant. Start your free trial
              today—no credit card required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-black font-semibold px-10 rounded-full"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600/50 hover:bg-purple-600/10 text-white px-10 rounded-full bg-black"
              >
                Schedule Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                Free for first 30 days
              </div>
              <div className="w-px h-4 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                Cancel anytime
              </div>
              <div className="w-px h-4 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                24/7 support
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}


export default CTA;