export type Track = {
  title: string;
  film: string;
  year: number;
  music: string;
  voice: string;
  /** YouTube video ID (the bit after v=). Empty falls back to a search link. */
  yt: string;
};

/**
 * Paste a YouTube video ID into `yt` for each song.
 * Prefer official label uploads — Lahari, Akash Audio, Anand Audio, Saregama.
 */
export const TRACKS: Track[] = [
  {
    title: "Neenello Naanalle",
    film: "Kannada Classic",
    year: 1980,
    music: "Classic",
    voice: "Dr. Rajkumar · Saritha",
    yt: "nxNha9W9dQw",
  },
  {
    title: "Aa Moda Baanalli Teladuta",
    film: "Dhruva Thare",
    year: 1985,
    music: "Classic",
    voice: "Dr. Rajkumar · Geetha",
    yt: "tQXtWqpcuGA",
  },
  {
    title: "Kuhu Kuhu Kogile",
    film: "Kannada Hit",
    year: 2000,
    music: "S. A. Rajkumar",
    voice: "Hariharan · K. S. Chithra",
    yt: "rUeyfai1ddc",
  },
  {
    title: "Geethanjali",
    film: "C.B.I. Shankar",
    year: 1989,
    music: "Classic",
    voice: "S. P. Balasubrahmanyam",
    yt: "56ul0WJ15TY",
  },
];
