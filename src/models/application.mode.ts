import {Schema} from "mongoose"; 
import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IApplication extends Document {
  jobId: string;
  company: string;
  status: "Applied" | "Interview" | "Rejected" | "Accepted";
  appliedDate: Date;
  notes?: string;
}

const applicationSchema = new Schema <IApplication>(
  {
    jobId: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected", "Accepted"],
      default: "Applied",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  },
);

export const Application =
  (mongoose.models.Application as mongoose.Model<IApplication>) ||
  mongoose.model<IApplication>("Application", applicationSchema); 
