export interface Course {
  _id: string;
  title: string;
  description: string;
  category: "core" | "pricing" | "premium";
  iconKey: string;
  price: string;
  features: string[];
  featured: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export const COURSE_CATEGORIES = [
  {
    value: "core",
    label: "Core Course",
    hint: 'Shown in the "Our Core Courses" grid on the homepage',
  },
  {
    value: "pricing",
    label: "Pricing Plan",
    hint: 'Shown in the "Beginner-Friendly Pricing" section',
  },
  {
    value: "premium",
    label: "Premium Plan",
    hint: 'Shown in the "Pick Your Session Format" section',
  },
];

export const ICON_OPTIONS = [
  { key: "chat", label: "Chat / Communication" },
  { key: "briefcase", label: "Business" },
  { key: "microphone", label: "Public Speaking" },
  { key: "book", label: "Language / English" },
  { key: "star", label: "Personality" },
  { key: "lightning", label: "Basic / Beginner" },
  { key: "chart", label: "Intermediate / Progress" },
  { key: "trophy", label: "Advanced / Achievement" },
  { key: "default", label: "Generic" },
];
