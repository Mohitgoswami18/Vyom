import {Schema} from "mongoose"; 

const applicationSchema = new Schema(
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

const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);