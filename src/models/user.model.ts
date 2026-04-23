import mongoose from "mongoose";
import { Schema } from "mongoose";
import {Document} from "mongoose"; 

export interface iUser extends Document {
  name: string;
  email: string;
  password?: string;
  provider: "credentials" | "oauth";
  image: string;
  phone: string;
  bio: string;
  isProfileComplete: boolean;
  skills: string[];
  education: string[];
  resumeLink: string;
  preferences: {
    role: string;
    location: string;
    stipend: number;
  };
  appliedCount: number;
  totalMatchFound: number;
  applicationSent: number;
  applications: mongoose.Types.ObjectId[];
  likedApplications: mongoose.Types.ObjectId[];
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      applicationUpdates: boolean;
      weeklyDigest: boolean;
    };
    privacy: {
      profileVisible: boolean;
      datacollection: boolean;
    };
  }
}

const userSchema = new Schema<iUser>(
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
      enum: ["credentials", "oauth"],
      default: "credentials",
    },

    image: String,
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },

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

export const User = mongoose.models.User as mongoose.Model<iUser> || mongoose.model<iUser>("User", userSchema);