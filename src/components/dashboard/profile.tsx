"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { User, Upload, X, Loader2, Check, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

export function Profile() {
  const { data: session, status } = useSession();

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  // --- File upload state ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string>("");
  const [existingProfilePicUrl, setExistingProfilePicUrl] = useState<string>("");
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        const user = data.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.preferences?.location || "",
          bio: user.bio || "",
        });
        setSkills(user.skills || []);
        setExistingResumeUrl(user.resumeLink || "");
        setExistingProfilePicUrl(user.profilePicture || user.image || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // --- Resume handlers ---
  const handleResumeClick = () => {
    fileInputRef.current?.click();
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF, DOC, or DOCX file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setResumeFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  // --- Profile picture handlers ---
  const handleProfilePicClick = () => {
    profilePicInputRef.current?.click();
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a JPEG, PNG, or WEBP image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setProfilePicFile(file);
      // Create a local preview
      setExistingProfilePicUrl(URL.createObjectURL(file));
      toast.success(`Selected: ${file.name}`);
    }
  };

  /**
   * Upload a file to /api/upload and return the Cloudinary URL.
   */
  const uploadFile = async (
    file: File,
    type: "resume" | "profile-picture",
  ): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || `Failed to upload ${type}`);
    }

    const data = await res.json();
    return data.url;
  };

  // --- Save handler: uploads files first, then saves profile ---
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);

    try {
      let resumeLink: string | undefined;
      let profilePicture: string | undefined;

      // Upload resume if a new file was selected
      if (resumeFile) {
        setIsUploadingResume(true);
        try {
          resumeLink = await uploadFile(resumeFile, "resume");
          setExistingResumeUrl(resumeLink);
          setResumeFile(null);
          toast.success("Resume uploaded to cloud!");
        } catch (err) {
          console.error("Resume upload error:", err);
          toast.error(
            err instanceof Error ? err.message : "Resume upload failed",
          );
          setIsSaving(false);
          setIsUploadingResume(false);
          return;
        } finally {
          setIsUploadingResume(false);
        }
      }

      // Upload profile picture if a new file was selected
      if (profilePicFile) {
        setIsUploadingPic(true);
        try {
          profilePicture = await uploadFile(profilePicFile, "profile-picture");
          setExistingProfilePicUrl(profilePicture);
          setProfilePicFile(null);
          toast.success("Profile picture uploaded!");
        } catch (err) {
          console.error("Profile picture upload error:", err);
          toast.error(
            err instanceof Error ? err.message : "Profile picture upload failed",
          );
          setIsSaving(false);
          setIsUploadingPic(false);
          return;
        } finally {
          setIsUploadingPic(false);
        }
      }

      // Save text fields + any new URLs to the profile
      const payload: Record<string, unknown> = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills,
      };

      if (resumeLink) payload.resumeLink = resumeLink;
      if (profilePicture) payload.profilePicture = profilePicture;

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save profile");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Picture & Basic Info */}
      <div className="rounded-xl border border-zinc-800/50 bg-[#101311] p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative h-32 w-32 shrink-0">
            {existingProfilePicUrl ? (
              <Image
                src={existingProfilePicUrl}
                alt="Profile"
                fill
                className="rounded-xl object-cover border border-zinc-800/50"
                unoptimized
              />
            ) : (
              <div className="h-full w-full rounded-xl bg-linear-to-br from-purple-500/40 to-blue-500/40 flex items-center justify-center border border-zinc-800/50">
                <User className="h-16 w-16 text-white" />
              </div>
            )}
            {/* Hidden file input for profile picture */}
            <input
              ref={profilePicInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleProfilePicChange}
              className="hidden"
            />
            <button
              onClick={handleProfilePicClick}
              disabled={isUploadingPic}
              className="absolute -bottom-2 -right-2 rounded-lg bg-purple-500 p-2.5 text-background hover:bg-purple-500/80 transition-colors disabled:opacity-50"
            >
              {isUploadingPic ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
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
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-zinc-800/50 bg-white/5 px-4 py-2.5 text-white placeholder-muted-foreground focus:border-accent focus:outline-none"
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
                  disabled
                  className="w-full rounded-lg border border-zinc-800/50 bg-white/5 px-4 py-2.5 text-white/50 placeholder-muted-foreground cursor-not-allowed focus:outline-none"
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
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-zinc-800/50 bg-white/5 px-4 py-2.5 text-white placeholder-muted-foreground focus:border-accent focus:outline-none"
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
                  placeholder="Enter your location"
                  className="w-full rounded-lg border border-zinc-800/50 bg-white/5 px-4 py-2.5 text-white placeholder-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-xl border border-zinc-800/50 bg-[#101311] p-8 backdrop-blur-xl">
        <label className="block text-sm font-medium text-white mb-3">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          placeholder="Tell us about yourself..."
          className="w-full rounded-lg border border-zinc-800/50 bg-white/5 px-4 py-2.5 text-white placeholder-muted-foreground focus:border-accent focus:outline-none"
        />
      </div>

      {/* Skills */}
      <div className="rounded-xl border border-zinc-800/50 bg-[#101311] p-8 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-semibold text-white">Skills</h3>

        {/* Add Skill */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            placeholder="Add a new skill..."
            className="flex-1 rounded-lg border border-zinc-800/50 bg-white/5 px-4 py-2.5 text-white placeholder-muted-foreground focus:border-accent focus:outline-none"
          />
          <Button
            onClick={handleAddSkill}
            className="bg-purple-500 hover:bg-purple-500/80 text-background"
          >
            Add
          </Button>
        </div>

        {/* Skills List */}
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No skills added yet. Add your first skill above.
            </p>
          )}
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-2 text-sm text-purple-500 border border-purple-500/30"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-purple-500/60 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Upload */}
      <div className="rounded-xl border border-zinc-800/50 bg-[#101311] p-8 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-semibold text-white">Resume</h3>

        {/* Show existing resume link if available */}
        {existingResumeUrl && !resumeFile && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
            <FileText className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-sm text-green-400 flex-1 truncate">
              Resume uploaded
            </span>
            <a
              href={existingResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
          className="hidden"
        />
        <div
          onClick={handleResumeClick}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files[0];
            if (file) {
              const validTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ];
              if (!validTypes.includes(file.type)) {
                toast.error("Please upload a PDF, DOC, or DOCX file");
                return;
              }
              if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB");
                return;
              }
              setResumeFile(file);
              toast.success(`Selected: ${file.name}`);
            }
          }}
          className="cursor-pointer rounded-lg border-2 border-dashed border-zinc-800/50 p-8 text-center hover:border-accent/50 transition-colors"
        >
          {resumeFile ? (
            <div className="flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-green-500" />
              <p className="text-white">{resumeFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB — Click to
                change
              </p>
              {isUploadingResume && (
                <div className="flex items-center gap-2 text-purple-400 text-xs mt-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-white">
                Drag and drop your resume or{" "}
                <span className="text-accent cursor-pointer hover:underline">
                  click to browse
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, DOC, or DOCX (max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-purple-500 hover:bg-purple-500/80 text-background px-8 py-2.5 flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isUploadingResume
                ? "Uploading resume..."
                : isUploadingPic
                  ? "Uploading picture..."
                  : "Saving..."}
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
