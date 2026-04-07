"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialSkills = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Machine Learning",
];

export function Profile() {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate about AI and software development with 2 years of experience in building scalable applications.",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Picture & Basic Info */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative h-32 w-32 flex-shrink-0">
            <div className="h-full w-full rounded-xl bg-gradient-to-br from-accent/40 to-blue-500/40 flex items-center justify-center border border-border/50">
              <User className="h-16 w-16 text-accent" />
            </div>
            <button className="absolute -bottom-2 -right-2 rounded-lg bg-accent p-2.5 text-background hover:bg-accent/80 transition-colors">
              <Upload className="h-4 w-4" />
            </button>
          </div>

          {/* Basic Info Form */}
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
        <label className="block text-sm font-medium text-muted-foreground mb-3">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
        />
      </div>

      {/* Skills */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-semibold text-foreground">Skills</h3>

        {/* Add Skill */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            placeholder="Add a new skill..."
            className="flex-1 rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none"
          />
          <Button
            onClick={handleAddSkill}
            className="bg-accent hover:bg-accent/80 text-background"
          >
            Add
          </Button>
        </div>

        {/* Skills List */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm text-accent border border-accent/30"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-accent/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Upload */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-semibold text-foreground">Resume</h3>
        <div className="rounded-lg border-2 border-dashed border-border/50 p-8 text-center hover:border-accent/50 transition-colors">
          <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-foreground">
            Drag and drop your resume or{" "}
            <span className="text-accent cursor-pointer hover:underline">
              click to browse
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, DOC, or DOCX (max 10MB)
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-accent hover:bg-accent/80 text-background px-8 py-2.5">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
