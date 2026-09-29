export interface Job {
  _id: string;
  title: string;
  type: string;
  workMode: string;
  responsibilities: string[];
  eligibility: string[];
  isActive: boolean;
  createdAt: string;
}

export const JOB_TYPES = ["Internship", "Full-time", "Part-time", "Contract"];
export const JOB_WORKMODES = ["Work From Home", "On-site", "Hybrid"];
