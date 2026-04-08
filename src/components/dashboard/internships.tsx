"use client";

import { useState } from "react";
import { Search, Filter, Heart, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockInternships = [
  {
    id: 1,
    company: "Google",
    position: "Software Engineer Intern",
    location: "Mountain View, CA",
    type: "Paid",
    duration: "12 weeks",
    salary: "$32/hr",
    matchScore: 95,
    description:
      "Work on cutting-edge AI and cloud technologies with world-class engineers.",
    skills: ["Python", "Go", "Distributed Systems"],
  },
  {
    id: 2,
    company: "Meta",
    position: "Product Manager Intern",
    location: "Menlo Park, CA",
    type: "Paid",
    duration: "12 weeks",
    salary: "$28/hr",
    matchScore: 88,
    description:
      "Help shape the future of social media and metaverse products.",
    skills: ["Product Strategy", "Data Analysis", "Communication"],
  },
  {
    id: 3,
    company: "OpenAI",
    position: "Machine Learning Intern",
    location: "San Francisco, CA",
    type: "Paid",
    duration: "12 weeks",
    salary: "$35/hr",
    matchScore: 92,
    description:
      "Contribute to advancing AI safety and capabilities in a cutting-edge research environment.",
    skills: ["Machine Learning", "Python", "PyTorch"],
  },
  {
    id: 4,
    company: "Netflix",
    position: "Data Science Intern",
    location: "Los Gatos, CA",
    type: "Paid",
    duration: "12 weeks",
    salary: "$30/hr",
    matchScore: 85,
    description:
      "Analyze user behavior and optimize content recommendation algorithms.",
    skills: ["Python", "SQL", "Statistics"],
  },
  {
    id: 5,
    company: "Microsoft",
    position: "Cloud Engineer Intern",
    location: "Redmond, WA",
    type: "Paid",
    duration: "12 weeks",
    salary: "$29/hr",
    matchScore: 80,
    description:
      "Build cloud infrastructure solutions using Azure and modern cloud technologies.",
    skills: ["Azure", "Kubernetes", "Terraform"],
  },
  {
    id: 6,
    company: "Amazon",
    position: "Solutions Architect Intern",
    location: "Seattle, WA",
    type: "Paid",
    duration: "12 weeks",
    salary: "$27/hr",
    matchScore: 78,
    description:
      "Design scalable solutions for enterprise clients using AWS services.",
    skills: ["AWS", "System Design", "Communication"],
  },
];

export function Internships() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [savedInternships, setSavedInternships] = useState<number[]>([]);

  const filteredInternships = mockInternships.filter((internship) => {
    const matchesSearch =
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => {
        if (filter === "high-match") return internship.matchScore >= 85;
        if (filter === "paid") return internship.type === "Paid";
        return true;
      });

    return matchesSearch && matchesFilter;
  });

  const toggleSave = (id: number) => {
    setSavedInternships((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Find Internships</h1>
        <p className="mt-2 text-muted-foreground">
          Discover opportunities matched to your skills with AI-powered
          recommendations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-zinc-800/50 bg-white/5 p-6 backdrop-blur-xl space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies or positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-800/50 bg-white/5 pl-10 pr-4 py-2.5 text-white placeholder-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <button className="rounded-lg border border-zinc-800/50 bg-secondary/30 p-2.5 hover:bg-secondary/50 transition-colors">
            <Filter className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Filter Tags */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "high-match", label: "High AI Match (85%+)" },
            { id: "paid", label: "Paid Internships" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedFilters.includes(filter.id)
                  ? "bg-accent text-background border border-accent"
                  : "bg-white/5 text-white border border-zinc-800/50 hover:bg-white/10"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredInternships.length} of {mockInternships.length}{" "}
        opportunities
      </p>

      {/* Internship Cards Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredInternships.map((internship) => (
          <div
            key={internship.id}
            className="group relative rounded-xl border border-zinc-800/50 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-linear-to-br from-purple-500/40 to-blue-500/40 border border-zinc-800/50" />
                  <div>
                    <h3 className="font-semibold text-white">
                      {internship.company}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {internship.position}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleSave(internship.id)}
                className={`transition-colors ${
                  savedInternships.includes(internship.id)
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-red-500"
                }`}
              >
                <Heart
                  className="h-5 w-5"
                  fill={
                    savedInternships.includes(internship.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>

            {/* Details */}
            <div className="mb-4 space-y-2 text-sm text-muted-foreground">
              <p>
                {internship.location} • {internship.type} •{" "}
                {internship.duration}
              </p>
              <p className="font-medium text-purple-500">{internship.salary}</p>
              <p className="text-white">{internship.description}</p>
            </div>

            {/* Match Score */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-500 to-blue-500"
                  style={{ width: `${internship.matchScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-purple-500">
                {internship.matchScore}%
              </span>
            </div>

            {/* Skills */}
            <div className="mb-6 flex flex-wrap gap-2">
              {internship.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1 bg-purple-500 hover:bg-purple-500/80 text-background">
                View Details
              </Button>
              <button className="rounded-lg border border-zinc-800/50 bg-secondary/30 p-2.5 hover:bg-secondary/50 transition-colors">
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
