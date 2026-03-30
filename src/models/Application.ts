import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  name: string;
  email: string;
  phone: string;
  position: string;
  message?: string;
  status: 'not_read' | 'read' | 'shortlisted' | 'rejected';
  createdAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['not_read', 'read', 'shortlisted', 'rejected'], default: 'not_read' },
  createdAt: { type: Date, default: Date.now },
});

delete (mongoose.models as Record<string, unknown>).Application;
export default mongoose.model<IApplication>('Application', ApplicationSchema);
