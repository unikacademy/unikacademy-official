import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'not_read' | 'read' | 'replied';
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['not_read', 'read', 'replied'], default: 'not_read' },
  createdAt: { type: Date, default: Date.now },
});

// Delete cached model so schema changes are always picked up (especially in Next.js dev hot-reload)
delete (mongoose.models as Record<string, unknown>).Contact;
export default mongoose.model<IContact>('Contact', ContactSchema);
