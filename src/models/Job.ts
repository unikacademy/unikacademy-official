import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  type: string;
  workMode: string;
  responsibilities: string[];
  eligibility: string[];
  isActive: boolean;
  createdAt: Date;
}

const JobSchema: Schema = new Schema({
  title:            { type: String, required: true },
  type:             { type: String, required: true },
  workMode:         { type: String, required: true },
  responsibilities: { type: [String], default: [] },
  eligibility:      { type: [String], default: [] },
  isActive:         { type: Boolean, default: true },
  createdAt:        { type: Date, default: Date.now },
});

delete (mongoose.models as Record<string, unknown>).Job;
export default mongoose.model<IJob>('Job', JobSchema);
