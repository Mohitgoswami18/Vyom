import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db.js";
import { User } from "@/models/user.model";
import * as pdfParse from "pdf-parse";
const pdf = (pdfParse as any).default ?? pdfParse;

/**
 * A curated set of tech / professional keywords to match against.
 * We extract words from the resume text and keep only those that match
 * known skill-like terms, so we get meaningful tags instead of noise.
 */
const KNOWN_SKILLS = new Set([
  // Programming languages
  "javascript", "typescript", "python", "java", "c", "c++", "c#", "go",
  "golang", "rust", "ruby", "php", "swift", "kotlin", "scala", "r",
  "perl", "haskell", "lua", "dart", "elixir", "clojure", "matlab",
  "assembly", "bash", "shell", "powershell", "sql", "nosql",

  // Frontend
  "react", "reactjs", "react.js", "angular", "angularjs", "vue",
  "vuejs", "vue.js", "svelte", "nextjs", "next.js", "nuxt", "nuxtjs",
  "gatsby", "html", "html5", "css", "css3", "sass", "scss", "less",
  "tailwind", "tailwindcss", "bootstrap", "material-ui", "chakra",
  "redux", "mobx", "zustand", "jquery", "webpack", "vite", "rollup",
  "parcel", "babel", "eslint", "prettier", "storybook",

  // Backend
  "node", "nodejs", "node.js", "express", "expressjs", "fastify",
  "nestjs", "koa", "django", "flask", "fastapi", "spring", "springboot",
  "rails", "laravel", "asp.net", ".net", "dotnet", "gin", "fiber",

  // Databases
  "mongodb", "mongoose", "postgresql", "postgres", "mysql", "sqlite",
  "redis", "elasticsearch", "dynamodb", "cassandra", "firebase",
  "firestore", "supabase", "prisma", "sequelize", "typeorm",

  // Cloud & DevOps
  "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s",
  "terraform", "ansible", "jenkins", "ci/cd", "github actions",
  "gitlab", "circleci", "nginx", "apache", "linux", "ubuntu",
  "serverless", "lambda", "vercel", "netlify", "heroku", "digitalocean",

  // Data / ML
  "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
  "scikit-learn", "pandas", "numpy", "scipy", "nlp",
  "computer vision", "opencv", "data science", "data analysis",
  "big data", "spark", "hadoop", "airflow", "tableau", "power bi",

  // Mobile
  "android", "ios", "react native", "flutter", "swiftui", "jetpack compose",
  "xamarin", "ionic", "cordova",

  // Tools & Concepts
  "git", "github", "bitbucket", "jira", "confluence", "figma",
  "adobe", "photoshop", "illustrator", "sketch", "xd",
  "agile", "scrum", "kanban", "devops", "microservices", "rest",
  "restful", "graphql", "grpc", "websocket", "oauth", "jwt",
  "api", "sdk", "testing", "jest", "mocha", "cypress", "selenium",
  "playwright", "puppeteer", "tdd", "bdd", "unit testing",

  // Soft skills / domains
  "leadership", "management", "communication", "teamwork",
  "problem solving", "analytical", "project management",
  "product management", "ui/ux", "ux", "ui", "design",
  "frontend", "backend", "fullstack", "full-stack", "full stack",
  "devops", "sre", "cybersecurity", "security", "blockchain",
  "web3", "solidity", "ethereum", "smart contracts",
]);

/**
 * Extract meaningful skill-like keywords from raw text.
 */
function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();

  const found = new Set<string>();

  // Check multi-word skills first
  for (const skill of KNOWN_SKILLS) {
    if (skill.includes(" ") || skill.includes("/") || skill.includes(".")) {
      if (lower.includes(skill)) {
        found.add(skill);
      }
    }
  }

  // Then check single-word skills by tokenising
  const words = lower.replace(/[^a-z0-9#+.\-/]/g, " ").split(/\s+/);
  for (const word of words) {
    if (word.length >= 1 && KNOWN_SKILLS.has(word)) {
      found.add(word);
    }
  }

  return Array.from(found);
}

// GET /api/resume/parse — extract keywords from the logged-in user's resume
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).select(
      "resumeLink"
    );

    if (!user || !user.resumeLink) {
      return NextResponse.json(
        { keywords: [], message: "No resume uploaded" },
        { status: 200 }
      );
    }

    // Fetch the PDF from Cloudinary
    const pdfResponse = await fetch(user.resumeLink);
    if (!pdfResponse.ok) {
      return NextResponse.json(
        { keywords: [], message: "Could not fetch resume file" },
        { status: 200 }
      );
    }

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF text
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // Extract keywords
    const keywords = extractKeywords(resumeText);

    return NextResponse.json({ keywords }, { status: 200 });
  } catch (error) {
    console.error("GET /api/resume/parse error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
