'use client';

import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Enter your skills, preferences, education, and career goals. Our AI learns what matters to you.",
  },
  {
    number: "02",
    title: "AI Searches & Filters",
    description:
      "Our agent scans thousands of internships daily and filters matches based on your profile.",
  },
  {
    number: "03",
    title: "Smart Matching",
    description:
      "Resume matching ensures you only see opportunities where you&apos;re truly a great fit.",
  },
  {
    number: "04",
    title: "One-Click Applications",
    description:
      "Apply to multiple internships instantly with auto-filled forms tailored to each role.",
  },
  {
    number: "05",
    title: "Track & Follow Up",
    description:
      "Monitor application status and get AI-powered reminders to follow up strategically.",
  },
  {
    number: "06",
    title: "Land Your Internship",
    description:
      "Get interviewed, negotiate, and accept the perfect opportunity for your career.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full pb-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-white font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A simple 6-step process to transform your internship search
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:flex flex-col items-center gap-8 mb-12">
          {steps.map((step, i) => (
            <div key={i} className="relative group w-full flex justify-center">
              <div className="flex items-start gap-6 max-w-3xl w-full justify-center">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-12 animate-pulse duration-700 h-12 rounded-full bg-linear-to-r from-purple-600 to-blue-400 flex items-center justify-center font-bold text-white shrink-0 mt-6">
                    {step.number}
                  </div>

                  {i < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-linear-to-b from-purple-600 to-transparent mt-2" />
                  )}
                </div>

                {/* Card */}
                <Card className="flex-1 border bg-[#141418]/40 border-border/50 hover:border-purple-600/50 transition-all duration-300 backdrop-blur-sm hover:bg-[#141418]/90 p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Vertical View */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 ">
              <div className="flex flex-col items-center ">
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-600 to-blue-400 flex items-center justify-center font-bold text-white shrink-0">
                  {step.number}
                </div>
                <div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-linear-to-b from-purple-600 to-transparent mt-2" />
                  )}
                </div>
              </div>

              <Card className="flex-1 border border-border/50 bg-[#141418]/40 backdrop-blur-sm p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default HowItWorks;