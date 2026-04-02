import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: 'core' | 'pricing' | 'premium';
  iconKey: string;       // for core courses — maps to a predefined SVG set on the frontend
  price: string;         // e.g. "1,000" — used by pricing & premium categories
  features: string[];    // bullet list — used by pricing & premium categories
  featured: boolean;     // shows "Most Popular" badge
  order: number;         // display order within the category
  isActive: boolean;
  createdAt: Date;
}

const CourseSchema: Schema = new Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, enum: ['core', 'pricing', 'premium'], required: true },
  iconKey:     { type: String, default: 'default' },
  price:       { type: String, default: '' },
  features:    { type: [String], default: [] },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now },
});

delete (mongoose.models as Record<string, unknown>).Course;
export default mongoose.model<ICourse>('Course', CourseSchema);
