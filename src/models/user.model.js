import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
    },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    image: String,

    skills: [String],
    education: [String],
    resumeLink: String,

    preferences: {
      role: { type: String, default: "developer" },
      location: { type: String, default: "remote" },
      stipend: { type: Number, default: 0 },
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    appliedCount: {
      type: Number,
      default: 0,
    },

    totalMatchFound: {
      type: Number,
      default: 0,
    },

    applicationSent: {
      type: Number,
      default: 0,
    },

    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
    ],

    likedApplications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        applicationUpdates: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: true },
      },
      privacy: {
        profileVisible: { type: Boolean, default: true },
        datacollection: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
