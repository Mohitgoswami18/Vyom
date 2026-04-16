"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Heart, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { POST } from "@/app/api/auth/signup/route";

export function Internships() {

  const [mockInternships, setMockInternships] = useState([]);
  const [expanded, setExpanded] = useState(
    Array.from({ length: mockInternships.length }),
  );
  const [data, setData] = useState(false);
  const [apiCalled, setApiCalled] = useState(false); 

  console.log(expanded)

  const jobsList = [];
  const findInternships = async () => {
    const res = await fetch("https://remotive.com/api/remote-jobs");

    const data = await res.json();
    if (!data) {
      console.log("error finding the jobs");
      return;
    }

    console.log("Fetched jobs are: ", data.jobs);
    if(data.jobs.length > 0) {
      console.log("f", data.jobs.length);
      for (let i = 0; i < data.jobs.length; i++) {
        const job = {
          id: data.jobs[i].id,
          company: data.jobs[i].company_name,
          position: data.jobs[i].title,
          location: data.jobs[i].candidate_required_location,
          type: data.jobs[i].job_type,
          duration: "3 months",
          salary: data.jobs[i].salary,
          description: data.jobs[i].description,
          matchScore: Math.floor(Math.random() * 100),
          skills: data.jobs[i].tags.slice(),
          logo: data.jobs[i].company_logo_url,
          liveLink: data.jobs[i].url,
        };

        jobsList.push(job);
        
      }
      setMockInternships(jobsList);
      setExpanded(Array.from({ length: jobsList.length }, ()=>false));
      setData(true);
      console.log("Mock internships: ", jobsList);
    } else {
      console.log("No jobs found in the response");
    }
  };

  useEffect(() => {
    findInternships();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [savedInternships, setSavedInternships] = useState<number[]>([]);

  function stripHTML(html) {
    const plainText = html.replace(/<[^>]+>/g, "");
    return plainText.length > 500 ? plainText.slice(0, 500) + "..." : plainText;
  }

  function getShortDescription(html) {
    const plainText = html.replace(/<[^>]+>/g, "");
    return plainText.length > 180 ? plainText.slice(0, 180) + "..." : plainText;
  }

  const toggleApiCall = async (internshipId: Number) => {
    if(apiCalled) return; 
    setApiCalled(true); 
    const result = await fetch("/jobs/whishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        internshipID: internshipId
      }),
    });

    if(!result.ok) {
      console.log("An error occured")
    }

    setApiCalled(false)

  }

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
        {filteredInternships.map((internship, idx) => (
          <div
            key={internship.id}
            className="group relative rounded-xl border border-zinc-800/50 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Briefcase size={30} className="text-gray-500" />
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
                onClick={() => {toggleSave(internship.id), toggleApiCall(internship.id)}}
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
              <div className="text-white">
                {expanded[idx]
                  ? stripHTML(internship.description)
                  : getShortDescription(internship.description)}
              </div>
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
              {internship.skills.slice(0, 10).map((skill) => (
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
              <Button
                className="flex-1 bg-purple-500 hover:bg-purple-500/80 text-background"
                onClick={() =>
                  setExpanded((prev) => {
                    const newExpanded = [...prev];
                    newExpanded[idx] = !newExpanded[idx];
                    return newExpanded;
                  })
                }
              >
                {expanded[idx] ? "Hide Details" : "View Details"}
              </Button>
              <a
              href={internship.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 items-center justify-center pt-2 hover:bg-white/10 text-background text-xs text-center rounded-md"
              >
                View Opportunity
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
