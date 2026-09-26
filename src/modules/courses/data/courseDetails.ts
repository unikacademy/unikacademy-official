export interface CourseModule {
  week: number;
  topic: string;
  description: string;
}

export interface CourseDetailData {
  id: string;
  title: string;
  subtitle: string;
  programType: string;
  overview: string;
  duration: string;
  totalSessions: number;
  sessionDuration: string;
  mode: string;
  conceptSessionsPerWeek: number;
  practiceSessionsPerWeek: number;
  totalHours: number;
  focusNote: string;
  modules: CourseModule[];
  outcomes: string[];
  targetAudience: { group: string; points: string[] }[];
}

export const courseDetailsData: CourseDetailData[] = [
  {
    id: "communication-skills",
    title: "Communication Skills",
    subtitle: "From Hesitation to Confidence in 90 Days",
    programType: "A 12-Week Intensive Communication Transformation Program",
    overview:
      "A practical, result-oriented communication training program designed to help individuals speak confidently, clearly, and effectively in real-life situations. Builds communication skills through a structured approach combining concept learning and intensive practice.",
    duration: "12 Weeks",
    totalSessions: 60,
    sessionDuration: "1 Hour",
    mode: "Live Interactive Sessions",
    conceptSessionsPerWeek: 2,
    practiceSessionsPerWeek: 3,
    totalHours: 60,
    focusNote:
      "Every concept is practiced multiple times to ensure real confidence and mastery.",
    modules: [
      {
        week: 1,
        topic: "Foundation & Mindset",
        description: "Basics of communication, overcoming fear",
      },
      {
        week: 2,
        topic: "Sentence Formation",
        description: "Basic structures, daily use sentences",
      },
      {
        week: 3,
        topic: "Tense Simplification",
        description: "Present, past and future usage",
      },
      {
        week: 4,
        topic: "Vocabulary Building",
        description: "High-frequency words, usage",
      },
      {
        week: 5,
        topic: "Thinking in English",
        description: "Removing translation habit, thought flow",
      },
      {
        week: 6,
        topic: "Fluency Development",
        description: "Linking words, continuous speaking",
      },
      {
        week: 7,
        topic: "Pronunciation",
        description: "Error correction, clarity",
      },
      {
        week: 8,
        topic: "Confidence Building",
        description: "Body language, voice modulation",
      },
      {
        week: 9,
        topic: "Public Speaking",
        description: "Speech structure, storytelling",
      },
      {
        week: 10,
        topic: "Real-Life Communication",
        description: "Daily and professional conversations",
      },
      {
        week: 11,
        topic: "Interview & GD Skills",
        description: "Interview techniques, group discussions",
      },
      {
        week: 12,
        topic: "Final Assessment",
        description: "Evaluation, feedback, improvement roadmap",
      },
    ],
    outcomes: [
      "Speak English confidently without hesitation",
      "Think in English without translating",
      "Improve fluency and clarity",
      "Handle real-life conversations effectively",
      "Perform well in interviews and group discussions",
      "Develop strong personality and confidence",
      "Speak in public without fear",
    ],
    targetAudience: [
      {
        group: "College Students",
        points: [
          "Preparing for placements and internships",
          "Facing hesitation in speaking English",
        ],
      },
      {
        group: "Working Professionals",
        points: [
          "Want to improve workplace communication",
          "Preparing for interviews or promotions",
        ],
      },
      {
        group: "General Learners",
        points: [
          "Anyone who understands English but struggles to speak fluently",
        ],
      },
    ],
  },
  {
    id: "personality-development",
    title: "Personality Development",
    subtitle: "Transform Your Personality and Stand Out Everywhere",
    programType: "A 12-Week Personality Transformation Program",
    overview:
      "A holistic personal development program designed to improve confidence, communication, mindset, and overall personality. Transforms how you think, behave, present yourself, and interact with others in both personal and professional life.",
    duration: "12 Weeks",
    totalSessions: 60,
    sessionDuration: "1 Hour",
    mode: "Live Interactive Sessions",
    conceptSessionsPerWeek: 2,
    practiceSessionsPerWeek: 3,
    totalHours: 60,
    focusNote:
      "Focused on real transformation through continuous practice and activities.",
    modules: [
      {
        week: 1,
        topic: "Self-Awareness & Mindset",
        description: "Understanding personality, growth mindset",
      },
      {
        week: 2,
        topic: "Confidence Building",
        description: "Overcoming self-doubt, building inner confidence",
      },
      {
        week: 3,
        topic: "Communication Basics",
        description: "Clarity in expression, effective communication",
      },
      {
        week: 4,
        topic: "Body Language",
        description: "Posture, gestures, and presence",
      },
      {
        week: 5,
        topic: "Grooming & Presentation",
        description: "Personal grooming, first impressions",
      },
      {
        week: 6,
        topic: "Emotional Intelligence",
        description: "Understanding and controlling emotions",
      },
      {
        week: 7,
        topic: "Social Skills",
        description: "Interaction and relationship building",
      },
      {
        week: 8,
        topic: "Leadership Skills",
        description: "Taking initiative and influencing others",
      },
      {
        week: 9,
        topic: "Time & Habit Management",
        description: "Productivity and positive habits",
      },
      {
        week: 10,
        topic: "Handling Pressure",
        description: "Managing stress and criticism",
      },
      {
        week: 11,
        topic: "Professional Personality",
        description: "Workplace behavior and etiquette",
      },
      {
        week: 12,
        topic: "Final Transformation",
        description: "Evaluation, feedback, improvement plan",
      },
    ],
    outcomes: [
      "Build strong and lasting confidence",
      "Develop a positive and growth-oriented mindset",
      "Communicate clearly and effectively",
      "Improve body language and personal presence",
      "Create powerful first impressions",
      "Build better relationships and social skills",
      "Develop leadership and decision-making ability",
      "Manage time and build productive habits",
      "Handle pressure and criticism confidently",
      "Transform your overall personality",
    ],
    targetAudience: [
      {
        group: "Students",
        points: [
          "Want to improve confidence and personality",
          "Preparing for career and future opportunities",
        ],
      },
      {
        group: "Working Professionals",
        points: [
          "Seeking growth, promotions, and leadership roles",
          "Want to improve presence and communication",
        ],
      },
      {
        group: "Individuals with Low Confidence",
        points: [
          "Feel shy or hesitant in social situations",
          "Want to overcome fear and build confidence",
        ],
      },
      {
        group: "Self-Improvement Seekers",
        points: ["Want to grow personally and professionally"],
      },
    ],
  },
  {
    id: "public-speaking",
    title: "Public Speaking",
    subtitle: "From Fear to Powerful Public Speaking",
    programType: "A 12-Week Public Speaking Mastery Program",
    overview:
      "A specialized program designed to help individuals overcome stage fear and become confident, impactful public speakers. Focuses on real speaking practice, stage exposure, and audience engagement techniques.",
    duration: "12 Weeks",
    totalSessions: 60,
    sessionDuration: "1 Hour",
    mode: "Live Interactive Sessions",
    conceptSessionsPerWeek: 2,
    practiceSessionsPerWeek: 3,
    totalHours: 60,
    focusNote:
      "Every week includes real speaking practice to build stage confidence.",
    modules: [
      {
        week: 1,
        topic: "Overcoming Stage Fear",
        description: "Understanding fear, confidence mindset",
      },
      {
        week: 2,
        topic: "Basics of Public Speaking",
        description: "Speech structure, fundamentals",
      },
      {
        week: 3,
        topic: "Voice & Delivery",
        description: "Voice modulation, clarity",
      },
      {
        week: 4,
        topic: "Body Language & Presence",
        description: "Gestures, eye contact, stage movement",
      },
      {
        week: 5,
        topic: "Content Creation",
        description: "Speech preparation and idea organization",
      },
      {
        week: 6,
        topic: "Storytelling Skills",
        description: "Engaging and connecting with audience",
      },
      {
        week: 7,
        topic: "Confidence on Stage",
        description: "Removing hesitation, smooth delivery",
      },
      {
        week: 8,
        topic: "Audience Engagement",
        description: "Interaction and attention techniques",
      },
      {
        week: 9,
        topic: "Persuasive Speaking",
        description: "Influencing and convincing audience",
      },
      {
        week: 10,
        topic: "Advanced Speaking",
        description: "Extempore speaking, handling nervousness",
      },
      {
        week: 11,
        topic: "Professional Speaking",
        description: "Event speaking and formal presentations",
      },
      {
        week: 12,
        topic: "Final Performance",
        description: "Final speech, feedback, improvement",
      },
    ],
    outcomes: [
      "Speak confidently in front of an audience",
      "Overcome fear of public speaking",
      "Improve voice, clarity, and delivery",
      "Structure and deliver impactful speeches",
      "Engage and influence your audience",
      "Speak without preparation (extempore)",
      "Perform better in presentations and events",
      "Build a strong and confident personality",
    ],
    targetAudience: [
      {
        group: "Individuals with Stage Fear",
        points: [
          "People who feel nervous speaking in front of others",
          "Those who want to overcome hesitation",
        ],
      },
      {
        group: "Students",
        points: [
          "Preparing for presentations and seminars",
          "Want to build confidence early",
        ],
      },
      {
        group: "Working Professionals",
        points: [
          "Need to speak in meetings and events",
          "Aim for leadership roles",
        ],
      },
      {
        group: "Aspiring Speakers",
        points: ["Trainers, influencers, and content creators"],
      },
    ],
  },
  {
    id: "spoken-english-grammar",
    title: "Spoken English & Grammar",
    subtitle: "From Zero to Fluent English Step-by-Step",
    programType: "A 12-Week Beginner English Foundation Program",
    overview:
      "A beginner-focused English foundation program designed to help learners understand grammar clearly and start speaking correct English confidently. Builds strong grammar fundamentals along with practical speaking practice.",
    duration: "12 Weeks",
    totalSessions: 60,
    sessionDuration: "1 Hour",
    mode: "Live Interactive Sessions",
    conceptSessionsPerWeek: 2,
    practiceSessionsPerWeek: 3,
    totalHours: 60,
    focusNote:
      "Learn grammar clearly and apply it through daily speaking practice.",
    modules: [
      {
        week: 1,
        topic: "Basics of English",
        description: "Parts of speech overview, basic sentence structure",
      },
      {
        week: 2,
        topic: "Nouns, Pronouns & Articles",
        description: "Usage and sentence formation",
      },
      {
        week: 3,
        topic: "Verbs & Helping Verbs",
        description: "Basic verbs and usage in sentences",
      },
      {
        week: 4,
        topic: "Present Tense",
        description: "Simple present and present continuous",
      },
      {
        week: 5,
        topic: "Past Tense",
        description: "Simple past and past continuous",
      },
      {
        week: 6,
        topic: "Future Tense",
        description: "Future forms and planning sentences",
      },
      {
        week: 7,
        topic: "Adjectives & Adverbs",
        description: "Sentence improvement and description",
      },
      { week: 8, topic: "Prepositions", description: "Time and place usage" },
      {
        week: 9,
        topic: "Question Formation",
        description: "WH questions and yes/no questions",
      },
      {
        week: 10,
        topic: "Grammar Correction",
        description: "Common mistakes and sentence improvement",
      },
      {
        week: 11,
        topic: "Daily Conversations",
        description: "Basic speaking in real-life situations",
      },
      {
        week: 12,
        topic: "Final Revision & Assessment",
        description: "Grammar revision and speaking evaluation",
      },
    ],
    outcomes: [
      "Understand basic grammar clearly",
      "Form correct sentences with confidence",
      "Speak simple English in daily situations",
      "Reduce common grammar mistakes",
      "Improve sentence formation skills",
      "Participate in basic conversations",
      "Build a strong foundation for advanced courses",
    ],
    targetAudience: [
      {
        group: "Beginners",
        points: [
          "Individuals who cannot speak English confidently",
          "Learners starting from zero level",
        ],
      },
      {
        group: "Students",
        points: [
          "School and college students",
          "Those struggling with grammar and speaking",
        ],
      },
      {
        group: "Job Seekers",
        points: [
          "Preparing for interviews",
          "Want to improve English basics for career growth",
        ],
      },
    ],
  },
];

export function getCourseSlug(courseTitle: string): string {
  return findCourseDetail(courseTitle)?.id ?? "";
}

// Matches a course title (from the `courses` table, nav, enroll form, …) to its
// detail page. Explicit aliases only — anything else (e.g. retired courses like
// "Basic Communication" or a "1-on-1" pricing row) returns null so callers can
// treat it as "not a course we sell".
export function findCourseDetail(courseTitle: string): CourseDetailData | null {
  if (!courseTitle) return null;
  const n = courseTitle.toLowerCase().trim();
  const byId = (id: string) =>
    courseDetailsData.find((c) => c.id === id) ?? null;
  if (n.includes("personality")) return byId("personality-development");
  if (n.includes("public")) return byId("public-speaking");
  if (n.includes("spoken") || n.includes("grammar"))
    return byId("spoken-english-grammar");
  if (n === "communication skills") return byId("communication-skills");
  return null;
}
