import mongoose, { Schema, Document } from 'mongoose';

export interface IDemoBooking extends Document {
  name: string;
  email?: string;
  phone: string;
  course: string;
  message?: string;
  status: 'not_read' | 'read' | 'replied';
  createdAt: Date;
}

const DemoBookingSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['not_read', 'read', 'replied'], default: 'not_read' },
  createdAt: { type: Date, default: Date.now },
});

delete (mongoose.models as Record<string, unknown>).DemoBooking;
export default mongoose.model<IDemoBooking>('DemoBooking', DemoBookingSchema);
