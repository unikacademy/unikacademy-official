// ─── Student reviews — the ONE place to add / edit reviews ───────────────────
// Real students' own words, unedited (only spacing fixed). Never invent review
// text here.
//
//  • Wrap a line in [[double brackets]] to give it the gold highlight.
//  • `headline` is the line shown large on the card — copy it from the review.
//  • `course` / `plan` are optional; leave them out until confirmed.
//  • A slot with `review: null` (text) or `youtube: null` (video) renders as a
//    "coming soon" card. Fill it in and it goes live.

export interface TextReview {
  name: string;
  course?: string;
  plan?: string;
  /** The one line shown big. Must appear in the review. */
  headline: string;
  /** Optional small line under the headline (featured card only). */
  note?: string;
  /** Optional before → now contrast, both quoted from the review. */
  beforeNow?: { before: string; now: string };
  /** Full review; paragraphs separated by a blank line, [[…]] = highlight. */
  review: string;
}

export interface VideoReview {
  name: string;
  course?: string;
  caption?: string;
  /** Any YouTube link: youtube.com/shorts/ID, youtu.be/ID or watch?v=ID. */
  youtube: string;
}

/** First entry is shown as the large featured card. */
export const TEXT_REVIEWS: (TextReview | null)[] = [
  {
    name: "Satyaranjan",
    headline: "If this review sounds clean, I'll give some credit to the classes!",
    note: "Written by a student who is still working on their communication skills.",
    beforeNow: {
      before: "I used to think communication was simply about knowing what to say.",
      now: "It's also about knowing how to express it, listen carefully, and make another person understand what you mean.",
    },
    review: `[[I used to think communication was simply about knowing what to say.]] I'm gradually learning that it's also about knowing how to express it, listen carefully, and make another person understand what you mean.

What I appreciate most about these one-on-one sessions is the personal attention and [[the opportunity to practise, make mistakes, and improve without feeling that every sentence needs to be perfect.]] [[The sessions offer genuine value for the price,]] and [[the learning feels personal rather than like a classroom experience.]] I'm still working on my communication skills, so [[if this review sounds clean, I'll give some credit to the classes!]]

If you're looking to become a more confident and effective communicator, I'd definitely recommend giving these sessions a try.`,
  },
  {
    // TODO: placeholder name — replace with the student's real name.
    name: "Riya S.",
    headline:
      "The tutor observes our performance and provides individual feedback on where we need to improve.",
    review: `UNIK Academy has a great approach to communication skills and personality development. I really appreciate [[the focus on practical learning, confidence building, and improving the way we express ourselves.]]

[[Each session includes different activities]] that help us improve our overall communication skills, public speaking, body language, and confidence. What I particularly like is that [[the tutor observes our performance and provides individual feedback on where we need to improve, what we might be lacking, and how we can work on it.]] This makes the learning experience more practical and [[helps us understand our strengths and areas for improvement.]]

Overall, I'm really impressed with UNIK Academy's approach. It's a great place for anyone who wants to become a more confident speaker, improve their personality, and communicate more effectively in both professional and social situations.`,
  },
  // Third review — coming soon.
  null,
];

/** YouTube Shorts video reviews. `null` = "coming soon" slot. */
export const VIDEO_REVIEWS: (VideoReview | null)[] = [null, null, null];

/** Extracts the video id from a YouTube / Shorts / youtu.be link. */
export function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:shorts\/|embed\/|watch\?(?:.*&)?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}
