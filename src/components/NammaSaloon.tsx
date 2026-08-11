"use client";

import { TRACKS } from "@/lib/tracks";
import { track as trackEvent } from "@vercel/analytics";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

function fmt(s: number) {
  return Number.isFinite(s)
    ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
    : "0:00";
}

function ytReady(): Promise<void> {
  return new Promise((res) => {
    if (window.YT?.Player) {
      res();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      res();
    };
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      )
    ) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
}

export default function NammaSaloon() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showTube, setShowTube] = useState(true);
  const [seek, setSeek] = useState(0);
  const [cur, setCur] = useState("0:00");
  const [dur, setDur] = useState("0:00");
  const [needsSearch, setNeedsSearch] = useState(false);
  const [title, setTitle] = useState("Sit down, put the sheet on");
  const [filmLine, setFilmLine] = useState(
    "Press play — the radio's on the shelf",
  );
  const [credits, setCredits] = useState("90s Kannada film songs");

  const playerRef = useRef<YT.Player | null>(null);
  const scrubbingRef = useRef(false);
  const idxRef = useRef(0);
  const playingRef = useRef(false);
  const loadRef = useRef<(autoplay: boolean, at?: number) => Promise<void>>(
    async () => {},
  );

  const track = TRACKS[idx];
  const ytId = track.yt.trim();

  const searchHref = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${track.title} ${track.film} Kannada song`,
  )}`;

  const setPlayingState = useCallback((on: boolean) => {
    playingRef.current = on;
    setPlaying(on);
  }, []);

  const step = useCallback((d: number) => {
    const next = (idxRef.current + d + TRACKS.length) % TRACKS.length;
    idxRef.current = next;
    setIdx(next);
    void loadRef.current(true, next);
  }, []);

  const ensurePlayer = useCallback(async () => {
    if (playerRef.current) return playerRef.current;
    await ytReady();
    await new Promise<void>((res) => {
      playerRef.current = new window.YT!.Player("ytplayer", {
        height: "1",
        width: "1",
        playerVars: { playsinline: 1, controls: 0 },
        events: {
          onReady: () => res(),
          onStateChange: (e) => {
            if (e.data === window.YT!.PlayerState.ENDED) step(1);
            if (e.data === window.YT!.PlayerState.PLAYING) setPlayingState(true);
            if (e.data === window.YT!.PlayerState.PAUSED) setPlayingState(false);
          },
          onError: () => {
            setNeedsSearch(false);
            setFilmLine("That upload won't play here — skipping");
            setTimeout(() => step(1), 1400);
          },
        },
      });
    });
    return playerRef.current!;
  }, [setPlayingState, step]);

  useEffect(() => {
    loadRef.current = async (autoplay: boolean, at = idxRef.current) => {
      const t = TRACKS[at];
      setTitle(t.title);
      setCredits(`${t.music} · ${t.voice}`);
      setSeek(0);
      setCur("0:00");
      setDur("0:00");
      document.title = `${t.title} — Namma`;

      if (autoplay) {
        trackEvent("song_play", {
          title: t.title,
          film: t.film,
          year: t.year,
        });
      }

      if (!t.yt.trim()) {
        setNeedsSearch(true);
        setFilmLine(`${t.film} (${t.year})`);
        setPlayingState(false);
        return;
      }

      setNeedsSearch(false);
      setFilmLine(`${t.film} (${t.year})`);
      const p = await ensurePlayer();
      p.loadVideoById(t.yt.trim());
      if (autoplay) p.playVideo();
      else p.pauseVideo();
    };
  }, [ensurePlayer, setPlayingState]);

  useEffect(() => {
    const start = Math.floor(Math.random() * TRACKS.length);
    idxRef.current = start;
    setIdx(start);
    const t = setTimeout(() => setShowTube(false), 1700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const poll = setInterval(() => {
      const player = playerRef.current;
      if (!player || scrubbingRef.current || !player.getDuration) return;
      const d = player.getDuration();
      const c = player.getCurrentTime();
      if (!d) return;
      setSeek(Math.round((c / d) * 1000));
      setCur(fmt(c));
      setDur(fmt(d));
    }, 250);
    return () => clearInterval(poll);
  }, [playing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (/^(INPUT|TEXTAREA)$/.test(tag)) return;
      if (e.code === "Space") {
        e.preventDefault();
        document.getElementById("play")?.click();
      }
      if (e.code === "ArrowRight") step(1);
      if (e.code === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step]);

  async function onPlay() {
    const t = TRACKS[idxRef.current];
    if (!t.yt.trim()) {
      await loadRef.current(false);
      return;
    }
    const p = await ensurePlayer();
    if (!p.getVideoData?.()?.video_id) {
      await loadRef.current(true);
      return;
    }
    if (playingRef.current) p.pauseVideo();
    else p.playVideo();
  }

  return (
    <>
      <div className="fan" aria-hidden="true" />
      {showTube ? <div className="tube" aria-hidden="true" /> : null}

      <div className="shell">
        <div className="room">
          <div className="stage">
            <div className="brand" aria-label="Namma Saloon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="brand-logo"
                src="/logo.png"
                alt="ನಮ್ಮ ಸಲೂನ್ · ESTD. ೧೯೪೦"
                width={1255}
                height={763}
                draggable={false}
              />
            </div>
          </div>

          <div className="dock">
            <div className="pill" role="region" aria-label="Now playing">
              <div
                className="disc"
                style={
                  {
                    "--progress": `${(seek / 1000) * 100}%`,
                  } as CSSProperties
                }
                aria-hidden="true"
              >
                <div className="disc-ring">
                  <div className="disc-face">
                    {ytId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt=""
                        src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
                      />
                    ) : null}
                    <span className="disc-hole" />
                  </div>
                </div>
              </div>

              <div className="pill-meta">
                <div className="pill-title" id="title">
                  {title}
                </div>
                <div className="pill-sub" id="film">
                  {needsSearch ? (
                    <a
                      href={searchHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {track.film} ({track.year}) · find on YouTube
                    </a>
                  ) : (
                    filmLine
                  )}
                </div>
                <input
                  type="range"
                  className="pill-seek"
                  id="seek"
                  min={0}
                  max={1000}
                  value={seek}
                  step={1}
                  aria-label="Seek within song"
                  style={
                    {
                      "--seek": `${(seek / 1000) * 100}%`,
                    } as CSSProperties
                  }
                  onInput={(e) => {
                    scrubbingRef.current = true;
                    const v = Number((e.target as HTMLInputElement).value);
                    setSeek(v);
                    const d = playerRef.current?.getDuration?.() || 0;
                    setCur(fmt((v / 1000) * d));
                  }}
                  onChange={(e) => {
                    scrubbingRef.current = false;
                    const player = playerRef.current;
                    if (player?.seekTo) {
                      player.seekTo(
                        (Number(e.target.value) / 1000) * player.getDuration(),
                        true,
                      );
                    }
                  }}
                />
                <div className="pill-time" id="credits">
                  {cur} / {dur}
                  <span className="pill-voice"> · {credits}</span>
                </div>
              </div>

              <div className="pill-controls">
                <button
                  className="pbtn"
                  id="prev"
                  aria-label="Previous song"
                  type="button"
                  onClick={() => step(-1)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 5h2.2v14H6zM18.5 5v14L8.2 12z" />
                  </svg>
                </button>
                <button
                  className="pbtn play"
                  id="play"
                  aria-label={playing ? "Pause" : "Play"}
                  type="button"
                  onClick={() => void onPlay()}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {playing ? (
                      <path d="M7 5h3.2v14H7zM13.8 5H17v14h-3.2z" />
                    ) : (
                      <path d="M8 5.5v13l11-6.5z" />
                    )}
                  </svg>
                </button>
                <button
                  className="pbtn"
                  id="next"
                  aria-label="Next song"
                  type="button"
                  onClick={() => step(1)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15.8 5H18v14h-2.2zM5.5 5l10.3 7L5.5 19z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="ytbox">
        <div id="ytplayer" />
      </div>
    </>
  );
}
