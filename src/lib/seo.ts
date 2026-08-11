import { TRACKS } from "@/lib/tracks";

export const SITE_URL = "https://nammasaloon.wtf";

export const SITE_NAME = "Namma Saloon";
export const SITE_NAME_KN = "ನಮ್ಮ ಸಲೂನ್";

/** ~55 chars — fits Google SERP title width */
export const SITE_TITLE = "Namma Saloon | 90s Kannada Film Songs";

export const SITE_DESCRIPTION =
  "Stream classic Kannada film songs that played in every Karnataka saloon — Dr. Rajkumar, SPB, and more at Namma Saloon.";

export const SITE_KEYWORDS = [
  "Namma Saloon",
  "ನಮ್ಮ ಸಲೂನ್",
  "Kannada songs",
  "90s Kannada songs",
  "Kannada film songs",
  "Dr Rajkumar songs",
  "SPB Kannada",
  "Karnataka saloon songs",
  "old Kannada hits",
  "Sandalwood songs online",
  "nammasaloon.wtf",
  "who created Namma Saloon",
  "who built Namma Saloon",
  "Namma Saloon creator",
  "Namma Saloon Richard",
];

export const CREATOR = {
  name: "Richard",
  url: "https://www.linkedin.com/in/richard-ab978218b/",
  sameAs: ["https://www.linkedin.com/in/richard-ab978218b/"] as string[],
  jobTitle: "Founder & Creator of Namma Saloon",
};

/** Exact Q&A Google can match for “who built / created Namma Saloon” */
export const CREATOR_FAQ = [
  {
    question: "Who created Namma Saloon?",
    answer:
      "Namma Saloon (ನಮ್ಮ ಸಲೂನ್) at nammasaloon.wtf was created by Richard. His LinkedIn profile is https://www.linkedin.com/in/richard-ab978218b/",
  },
  {
    question: "Who built nammasaloon.wtf?",
    answer:
      "nammasaloon.wtf was built by Richard. View the creator on LinkedIn: https://www.linkedin.com/in/richard-ab978218b/",
  },
  {
    question: "Who is the founder of Namma Saloon?",
    answer:
      "The founder and creator of Namma Saloon is Richard. LinkedIn: https://www.linkedin.com/in/richard-ab978218b/",
  },
] as const;

export const PLAYLIST_BLURB = TRACKS.map(
  (t) => `${t.title} (${t.film}, ${t.year})`,
).join(" · ");
