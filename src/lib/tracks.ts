export type Track = {
  title: string;
  film: string;
  year: number;
  music: string;
  voice: string;
  /** Local MP3 under /public/audio */
  audio: string;
  /** YouTube ID for disc art / SEO links */
  yt: string;
};

export const TRACKS: Track[] = [
  {
    title: "Neenello Naanalle",
    film: "Kannada Classic",
    year: 1980,
    music: "Classic",
    voice: "Dr. Rajkumar · Saritha",
    audio: "/audio/neenello-naanalle.mp3",
    yt: "nxNha9W9dQw",
  },
  {
    title: "Aa Moda Baanalli Teladuta",
    film: "Dhruva Thare",
    year: 1985,
    music: "Classic",
    voice: "Dr. Rajkumar · Geetha",
    audio: "/audio/aa-moda-baanalli.mp3",
    yt: "tQXtWqpcuGA",
  },
  {
    title: "Kuhu Kuhu Kogile",
    film: "Kannada Hit",
    year: 2000,
    music: "S. A. Rajkumar",
    voice: "Hariharan · K. S. Chithra",
    audio: "/audio/kuhu-kuhu-kogile.mp3",
    yt: "rUeyfai1ddc",
  },
  {
    title: "Geethanjali",
    film: "C.B.I. Shankar",
    year: 1989,
    music: "Classic",
    voice: "S. P. Balasubrahmanyam",
    audio: "/audio/geethanjali.mp3",
    yt: "56ul0WJ15TY",
  },
];
