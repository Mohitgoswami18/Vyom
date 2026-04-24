"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Loader2,
  ExternalLink,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Internship {
  id: string | number;
  company: string;
  position: string;
  location: string;
  type: string;
  duration: string;
  salary: string;
  description: string;
  matchScore: number;
  skills: string[];
  logo: string;
  liveLink: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Compute match score: % of job tags that appear in user skills */
function computeMatchScore(
  jobTags: string[],
  userSkills: string[],
): number {
  if (!jobTags.length || !userSkills.length) return 0;

  const normalised = userSkills.map((s) => s.toLowerCase().trim());

  const matched = jobTags.filter((tag) =>
    normalised.some(
      (skill) =>
        skill === tag.toLowerCase().trim() ||
        skill.includes(tag.toLowerCase().trim()) ||
        tag.toLowerCase().trim().includes(skill),
    ),
  );

  return Math.round((matched.length / jobTags.length) * 100);
}

function stripHTML(html: string) {
  const plainText = html.replace(/<[^>]+>/g, "");
  return plainText.length > 500 ? plainText.slice(0, 500) + "..." : plainText;
}

function getShortDescription(html: string) {
  const plainText = html.replace(/<[^>]+>/g, "");
  return plainText.length > 180 ? plainText.slice(0, 180) + "..." : plainText;
}

function scoreColor(score: number) {
  if (score >= 85) return "text-emerald-400";
  if (score >= 70) return "text-blue-400";
  if (score >= 60) return "text-purple-400";
  return "text-zinc-400";
}

function scoreBarGradient(score: number) {
  if (score >= 85) return "from-emerald-500 to-cyan-400";
  if (score >= 70) return "from-blue-500 to-indigo-400";
  if (score >= 60) return "from-purple-500 to-blue-500";
  return "from-zinc-500 to-zinc-400";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Internships() {
  const [selectedTab, setSelectedTab] = useState<"all" | "matching">("all");
  const [internships, setInternships] = useState<Internship[]>([]);
  const [expanded, setExpanded] = useState<boolean[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Track which jobs the user has applied to (by jobId)
  const [appliedJobs, setAppliedJobs] = useState<Set<string | number>>(
    new Set(),
  );
  const [applyingTo, setApplyingTo] = useState<string | number | null>(null);

  /* ---------- Fetch user profile for skills ---------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setUserSkills(data.user?.skills ?? []);

          // Pre-populate already-applied job IDs
          if (data.user?.applications) {
            const ids = new Set<string | number>(
              data.user.applications.map((a: any) => a.jobId ?? a),
            );
            setAppliedJobs(ids);
          }
        }
      } catch {
        // Profile not available — match scores stay at 0
      } finally {
        setProfileLoaded(true);
      }
    };
    fetchProfile();
  }, []);

  /* ---------- Fetch internships ---------- */
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await fetch("https://remotive.com/api/remote-jobs");
        const responseData = await res.json();
        if (!responseData?.jobs?.length) return;

        const jobs: Internship[] = responseData.jobs.map((j: any) => ({
          id: j.id,
          company: j.company_name,
          position: j.title,
          location: j.candidate_required_location,
          type: j.job_type,
          duration: "3 months",
          salary: j.salary,
          description: j.description,
          matchScore: 0, // calculated below once profile loads
          skills: j.tags?.slice() ?? [],
          logo: j.company_logo_url,
          liveLink: j.url,
        }));

        setInternships(jobs);
        setExpanded(Array.from({ length: jobs.length }, () => false));
        setDataLoaded(true);
      } catch (err) {
        console.error("Error fetching internships:", err);
      }
    };
    fetchInternships();
  }, []);

  /* ---------- Recalculate match scores when skills or jobs change ---------- */
  const scoredInternships = useMemo(() => {
    if (!profileLoaded) return internships;

    return internships.map((job) => ({
      ...job,
      matchScore: computeMatchScore(job.skills, userSkills),
    }));
  }, [internships, userSkills, profileLoaded]);

  /* ---------- Filtering ---------- */
  const filteredInternships = useMemo(() => {
    let list = scoredInternships;

    // Tab filter
    if (selectedTab === "matching") {
      list = list.filter((i) => i.matchScore >= 60);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.company.toLowerCase().includes(q) ||
          i.position.toLowerCase().includes(q) ||
          i.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }

    // Tag filters
    if (selectedFilters.length) {
      list = list.filter((i) =>
        selectedFilters.some((f) => {
          if (f === "high-match") return i.matchScore >= 85;
          if (f === "paid") return i.salary && i.salary.length > 1;
          return true;
        }),
      );
    }

    // Sort matched tab by score desc
    if (selectedTab === "matching") {
      list = [...list].sort((a, b) => b.matchScore - a.matchScore);
    }

    return list;
  }, [scoredInternships, selectedTab, searchQuery, selectedFilters]);

  const matchedCount = useMemo(
    () => scoredInternships.filter((i) => i.matchScore >= 60).length,
    [scoredInternships],
  );

  /* ---------- Handlers ---------- */
  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const handleApply = async (internship: Internship) => {
    if (appliedJobs.has(internship.id)) return;

    setApplyingTo(internship.id);
    try {
      const res = await fetch("/api/internships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: internship.id,
          company: internship.company,
        }),
      });

      if (res.status === 409) {
        toast.info("You have already applied to this internship");
        setAppliedJobs((prev) => new Set(prev).add(internship.id));
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to apply");
      }

      setAppliedJobs((prev) => new Set(prev).add(internship.id));
      toast.success(`Applied to ${internship.company} successfully!`);
    } catch (error) {
      console.error("Apply error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to apply",
      );
    } finally {
      setApplyingTo(null);
    }
  };

  /* ---------- Card renderer ---------- */
  const renderCard = (internship: Internship, idx: number) => {
    const isApplied = appliedJobs.has(internship.id);
    const isApplying = applyingTo === internship.id;

    return (
      <div
        key={internship.id}
        className="group relative rounded-xl border border-zinc-800/50 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5"
      >
        {/* Match badge (matching tab only) */}
        {selectedTab === "matching" && (
          <div className="absolute -top-3 right-4 flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-700/60 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className={`text-xs font-bold ${scoreColor(internship.matchScore)}`}>
              {internship.matchScore}% match
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {internship.logo ? (
              <img
                src={internship.logo}
                alt={internship.company}
                className="h-10 w-10 rounded-lg object-contain bg-white/10 p-1"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Briefcase className="h-5 w-5 text-zinc-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white leading-tight">
                {internship.company}
              </h3>
              <p className="text-sm text-muted-foreground">
                {internship.position}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
          <p>
            {internship.location} • {internship.type} •{" "}
            {internship.duration}
          </p>
          {internship.salary && internship.salary.length > 1 && (
            <p className="font-medium text-emerald-400">
              {internship.salary}
            </p>
          )}
          <div className="text-zinc-300 leading-relaxed">
            {expanded[idx]
              ? stripHTML(internship.description)
              : getShortDescription(internship.description)}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {internship.skills.slice(0, 8).map((skill) => {
            const isUserSkill = userSkills.some(
              (us) =>
                us.toLowerCase().trim() === skill.toLowerCase().trim() ||
                us.toLowerCase().includes(skill.toLowerCase().trim()) ||
                skill.toLowerCase().trim().includes(us.toLowerCase()),
            );
            return (
              <span
                key={skill}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  isUserSkill
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-white/5 text-zinc-400 border border-zinc-800/50"
                }`}
              >
                {skill}
              </span>
            );
          })}
        </div>

        {/* Match score bar (matching tab) */}
        {selectedTab === "matching" && (
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className={`h-4 w-4 ${scoreColor(internship.matchScore)}`} />
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${scoreBarGradient(internship.matchScore)} transition-all duration-700`}
                style={{ width: `${internship.matchScore}%` }}
              />
            </div>
            <span className={`text-sm font-bold tabular-nums ${scoreColor(internship.matchScore)}`}>
              {internship.matchScore}%
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-white/5 border border-zinc-800/50 hover:bg-white/10 text-white"
            onClick={() =>
              setExpanded((prev) => {
                const next = [...prev];
                next[idx] = !next[idx];
                return next;
              })
            }
          >
            {expanded[idx] ? "Hide Details" : "View Details"}
          </Button>

          {isApplied ? (
            <Button
              disabled
              className="flex-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 cursor-default"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Applied
            </Button>
          ) : (
            <Button
              disabled={isApplying}
              onClick={() => handleApply(internship)}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Now"
              )}
            </Button>
          )}

          <a
            href={internship.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg border border-zinc-800/50 bg-white/5 px-3 hover:bg-white/10 transition-colors"
            title="View original posting"
          >
            <ExternalLink className="h-4 w-4 text-zinc-400" />
          </a>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

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

      {/* Tabs */}
      <div className="flex items-center gap-2 rounded-xl border border-zinc-800/50 bg-white/5 p-1.5 w-fit">
        <button
          onClick={() => setSelectedTab("all")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
            selectedTab === "all"
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          All Internships
        </button>
        <button
          onClick={() => setSelectedTab("matching")}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
            selectedTab === "matching"
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Matched
          {dataLoaded && profileLoaded && (
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                selectedTab === "matching"
                  ? "bg-white/20 text-white"
                  : "bg-purple-500/20 text-purple-400"
              }`}
            >
              {matchedCount}
            </span>
          )}
        </button>
      </div>

      {dataLoaded ? (
        <>
          {/* Search & Filters */}
          <div className="rounded-xl border border-zinc-800/50 bg-white/5 p-6 backdrop-blur-xl space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search companies, positions, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800/50 bg-white/5 pl-10 pr-4 py-2.5 text-white placeholder-muted-foreground focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <button className="rounded-lg border border-zinc-800/50 bg-white/5 p-2.5 hover:bg-white/10 transition-colors">
                <Filter className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Filter Tags */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "high-match", label: "High Match (85%+)" },
                { id: "paid", label: "Paid Internships" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedFilters.includes(filter.id)
                      ? "bg-purple-500 text-white border border-purple-400"
                      : "bg-white/5 text-zinc-400 border border-zinc-800/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredInternships.length}
              </span>{" "}
              {selectedTab === "matching"
                ? `matched opportunities (≥60% match)`
                : `of ${scoredInternships.length} opportunities`}
            </p>
            {selectedTab === "matching" && userSkills.length === 0 && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Add skills to your profile for better matches</span>
              </div>
            )}
          </div>

          {/* Empty state for matched tab */}
          {selectedTab === "matching" && filteredInternships.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800/50 bg-white/5 p-16 text-center">
              <div className="mb-4 rounded-full bg-purple-500/10 p-4">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No matched internships yet
              </h3>
              <p className="text-muted-foreground max-w-md">
                {userSkills.length === 0
                  ? "Add skills to your profile to see internships matched to your expertise."
                  : "No internships match your profile with 60% or higher. Try expanding your skill set!"}
              </p>
            </div>
          ) : (
            /* Internship Cards Grid */
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredInternships.map((internship, idx) =>
                renderCard(internship, idx),
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Spinner className="h-8 w-8 text-purple-500" />
          <p className="text-lg text-muted-foreground font-medium">
            Searching for internships...
          </p>
        </div>
      )}
    </div>
  );
}
