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
    title: "Huttidare Kannada Nadalli Huttabeku",
    film: "Aakasmika",
    year: 1993,
    music: "Hamsalekha",
    voice: "Dr. Rajkumar",
    yt: "",
  },
  {
    title: "Kelisade Kallu Kallinali",
    film: "Belli Kalungura",
    year: 1992,
    music: "Hamsalekha",
    voice: "S. P. Balasubrahmanyam",
    yt: "",
  },
  {
    title: "Maama Maama Chandamaama",
    film: "Belli Kalungura",
    year: 1992,
    music: "Hamsalekha",
    voice: "SPB · K. S. Chithra",
    yt: "",
  },
  {
    title: "Mutthinantha Hudugi",
    film: "Hosa Kalla Hale Kulla",
    year: 1992,
    music: "Hamsalekha",
    voice: "Rajesh Krishnan",
    yt: "",
  },
  {
    title: "Prathama Chumbana",
    film: "Kadambari",
    year: 1993,
    music: "Hamsalekha",
    voice: "Rajesh Krishnan",
    yt: "",
  },
  {
    title: "Gadibidi Ganda Neenu",
    film: "Gadibidi Ganda",
    year: 1993,
    music: "Hamsalekha",
    voice: "SPB · K. S. Chithra",
    yt: "",
  },
  {
    title: "Ambaraveri",
    film: "Rasika",
    year: 1994,
    music: "Hamsalekha",
    voice: "S. P. Balasubrahmanyam",
    yt: "",
  },
  {
    title: "Kaveri Theeradalli",
    film: "Kaveri Theeradalli",
    year: 1994,
    music: "Vijay Anand",
    voice: "Latha Hamsalekha",
    yt: "",
  },
  {
    title: "Hey Dinakara",
    film: "Om",
    year: 1995,
    music: "Hamsalekha",
    voice: "Dr. Rajkumar",
    yt: "",
  },
  {
    title: "Hoovamma Hoovamma",
    film: "Mojugara Sogasugara",
    year: 1995,
    music: "Hamsalekha",
    voice: "Mano · Latha Hamsalekha",
    yt: "",
  },
  {
    title: "Cementina Seemeyali",
    film: "Eshwar",
    year: 1995,
    music: "Hamsalekha",
    voice: "SPB · Latha Hamsalekha",
    yt: "",
  },
  {
    title: "Danthada Gombe",
    film: "Cheluva",
    year: 1997,
    music: "Hamsalekha",
    voice: "Mano · Latha Hamsalekha",
    yt: "",
  },
  {
    title: "Tarikere Erimele",
    film: "Premachari",
    year: 1999,
    music: "Hamsalekha",
    voice: "Rajesh Krishnan · Chithra",
    yt: "",
  },
  {
    title: "Manasina Goodalli",
    film: "Coolie Raja",
    year: 1999,
    music: "Hamsalekha",
    voice: "Rajesh Krishnan",
    yt: "",
  },
  {
    title: "Titanic Heroine",
    film: "Snehaloka",
    year: 1999,
    music: "Hamsalekha",
    voice: "Sonu Nigam",
    yt: "",
  },
];
