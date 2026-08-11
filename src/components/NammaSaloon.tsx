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

export default function NammaSaloon() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showTube, setShowTube] = useState(true);
  const [lightsOn, setLightsOn] = useState(true);
  const [fanOn, setFanOn] = useState(false);
  const [seek, setSeek] = useState(0);
  const [cur, setCur] = useState("0:00");
  const [dur, setDur] = useState("0:00");
  const [needsSearch, setNeedsSearch] = useState(false);
  const [title, setTitle] = useState("Sit down, put the sheet on");
  const [filmLine, setFilmLine] = useState(
    "Press play — the radio's on the shelf",
  );
  const [credits, setCredits] = useState("90s Kannada film songs");
  const [listeners, setListeners] = useState(0);
  const [pullY, setPullY] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srcRef = useRef("");
  const scrubbingRef = useRef(false);
  const idxRef = useRef(0);
  const playingRef = useRef(false);
  const acRef = useRef<AudioContext | null>(null);
  const fanNodesRef = useRef<{
    stop: () => void;
  } | null>(null);
  const loadRef = useRef<(autoplay: boolean, at?: number) => Promise<void>>(
    async () => {},
  );

  const track = TRACKS[idx];
  const ytId = track.yt.trim();
  const coverSrc = ytId
    ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
    : "/logo.png";

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

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onPlaying = () => setPlayingState(true);
    const onPause = () => setPlayingState(false);
    const onEnded = () => step(1);
    const onLoaded = () => {
      if (Number.isFinite(audio.duration)) setDur(fmt(audio.duration));
    };
    const onError = () => {
      setNeedsSearch(true);
      setFilmLine("Couldn't load that track");
      setPlayingState(false);
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
      audio.src = "";
      audioRef.current = null;
    };
  }, [setPlayingState, step]);

  useEffect(() => {
    loadRef.current = async (autoplay: boolean, at = idxRef.current) => {
      const t = TRACKS[at];
      const audio = audioRef.current;
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

      if (!t.audio.trim()) {
        setNeedsSearch(true);
        setFilmLine(`${t.film} (${t.year})`);
        setPlayingState(false);
        return;
      }

      setNeedsSearch(false);
      setFilmLine(`${t.film} (${t.year})`);
      if (!audio) return;

      if (srcRef.current !== t.audio) {
        srcRef.current = t.audio;
        audio.src = t.audio;
        audio.load();
      }

      if (autoplay) {
        try {
          await audio.play();
        } catch {
          setPlayingState(false);
        }
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [setPlayingState]);

  useEffect(() => {
    const start = Math.floor(Math.random() * TRACKS.length);
    idxRef.current = start;
    setIdx(start);
    void loadRef.current(false, start);
    const t = setTimeout(() => setShowTube(false), 1700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const poll = setInterval(() => {
      const audio = audioRef.current;
      if (!audio || scrubbingRef.current) return;
      const d = audio.duration;
      const c = audio.currentTime;
      if (!d || !Number.isFinite(d)) return;
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
    const audio = audioRef.current;
    if (!t.audio.trim() || !audio) {
      setNeedsSearch(true);
      return;
    }

    if (srcRef.current !== t.audio) {
      await loadRef.current(true);
      return;
    }

    if (playingRef.current) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      trackEvent("song_play", {
        title: t.title,
        film: t.film,
        year: t.year,
      });
    } catch {
      setFilmLine("Tap play again — browser blocked audio");
    }
  }

  function getAudio() {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!acRef.current) acRef.current = new Ctx();
    return acRef.current;
  }

  function playSwitchClick(on: boolean) {
    try {
      navigator.vibrate?.(on ? [14, 28, 10] : [10, 22, 16]);
    } catch {
      /* vibrate unsupported */
    }

    const ac = getAudio();
    void ac.resume();
    const t0 = ac.currentTime;

    const thud = ac.createOscillator();
    const thudGain = ac.createGain();
    thud.type = "triangle";
    thud.frequency.setValueAtTime(on ? 140 : 110, t0);
    thud.frequency.exponentialRampToValueAtTime(55, t0 + 0.06);
    thudGain.gain.setValueAtTime(0.0001, t0);
    thudGain.gain.exponentialRampToValueAtTime(0.14, t0 + 0.004);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);
    thud.connect(thudGain).connect(ac.destination);
    thud.start(t0);
    thud.stop(t0 + 0.09);

    const click = ac.createOscillator();
    const clickGain = ac.createGain();
    click.type = "sine";
    click.frequency.setValueAtTime(on ? 980 : 420, t0 + 0.012);
    click.frequency.exponentialRampToValueAtTime(on ? 520 : 240, t0 + 0.05);
    clickGain.gain.setValueAtTime(0.0001, t0 + 0.012);
    clickGain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.016);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.07);
    click.connect(clickGain).connect(ac.destination);
    click.start(t0 + 0.012);
    click.stop(t0 + 0.08);
  }

  function stopFanSound() {
    fanNodesRef.current?.stop();
    fanNodesRef.current = null;
  }

  function startFanSound() {
    stopFanSound();
    const ac = getAudio();
    void ac.resume();

    const secs = 3;
    const buf = ac.createBuffer(1, ac.sampleRate * secs, ac.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.2;
    }

    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 240;
    lp.Q.value = 2.5;
    const wob = ac.createGain();
    wob.gain.value = 0.55;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 4.4;
    const lfoAmt = ac.createGain();
    lfoAmt.gain.value = 0.28;
    const master = ac.createGain();
    master.gain.value = 0.22;
    lfo.connect(lfoAmt).connect(wob.gain);
    src.connect(lp).connect(wob).connect(master).connect(ac.destination);
    src.start();
    lfo.start();

    fanNodesRef.current = {
      stop: () => {
        try {
          src.stop();
          lfo.stop();
        } catch {
          /* already stopped */
        }
        master.disconnect();
      },
    };
  }

  useEffect(() => {
    return () => stopFanSound();
  }, []);

  useEffect(() => {
    const THRESHOLD = 78;
    let startY = 0;
    let active = false;
    let dy = 0;

    const ignoreTarget = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!el?.closest?.(
        "input, textarea, button, a, .pill-seek, .pill-controls, .room-switches",
      );
    };

    const onStart = (e: TouchEvent) => {
      if (ignoreTarget(e.target)) return;
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      if (startY > window.innerHeight * 0.55) return;
      active = true;
      dy = 0;
    };

    const onMove = (e: TouchEvent) => {
      if (!active) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      if (dy > 8) setPullY(Math.min(dy * 0.55, 110));
    };

    const onEnd = () => {
      if (!active) return;
      active = false;
      if (dy >= THRESHOLD) {
        setPullY(64);
        window.location.reload();
        return;
      }
      setPullY(0);
      dy = 0;
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  useEffect(() => {
    const MIN = 120;
    const MAX = 320;
    const KEY = "namma-listeners";

    let start = MIN + 80;
    try {
      const saved = Number(window.localStorage.getItem(KEY));
      if (Number.isFinite(saved) && saved >= MIN && saved <= MAX) {
        start = Math.round(saved);
      } else {
        const hour = new Date().getHours();
        start = MIN + ((hour * 17) % (MAX - MIN + 1));
      }
    } catch {
      /* private mode */
    }
    setListeners(start);

    const tick = window.setInterval(() => {
      setListeners((n) => {
        const roll = Math.random();
        let next = n;
        if (roll < 0.4) next = Math.max(MIN, n - 4);
        else if (roll < 0.8) next = Math.min(MAX, n + 4);
        try {
          window.localStorage.setItem(KEY, String(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    }, 5000);

    return () => window.clearInterval(tick);
  }, []);

  function toggleLights() {
    setLightsOn((on) => {
      const next = !on;
      playSwitchClick(next);
      trackEvent("tube_light", { on: next });
      if (next) {
        setShowTube(true);
        window.setTimeout(() => setShowTube(false), 1400);
      }
      return next;
    });
  }

  function toggleFan() {
    setFanOn((on) => {
      const next = !on;
      playSwitchClick(next);
      trackEvent("ceiling_fan", { on: next });
      if (next) startFanSound();
      else stopFanSound();
      return next;
    });
  }

  return (
    <>
      <div
        className={`pull-refresh${pullY > 12 ? " is-visible" : ""}${pullY >= 78 ? " is-ready" : ""}`}
        style={{ transform: `translate(-50%, ${Math.max(pullY - 36, -40)}px)` }}
        aria-hidden="true"
      >
        <span
          className="pull-refresh__spinner"
          style={
            pullY < 78
              ? { transform: `rotate(${pullY * 3.2}deg)` }
              : undefined
          }
        />
      </div>

      <div className={`fan${fanOn ? "" : " is-off"}`} aria-hidden="true" />
      {showTube && lightsOn ? (
        <div className="tube" aria-hidden="true" />
      ) : null}
      <div
        className={`lights-veil${lightsOn ? "" : " is-on"}`}
        aria-hidden="true"
      />

      <div className="room-switches" role="group" aria-label="Room switches">
        <button
          type="button"
          className="glass-switch"
          aria-pressed={lightsOn}
          onClick={toggleLights}
        >
          <span className="glass-switch__label">Light</span>
          <span className="glass-switch__track" aria-hidden="true">
            <span className="glass-switch__thumb" />
          </span>
        </button>
        <button
          type="button"
          className="glass-switch"
          aria-pressed={fanOn}
          onClick={toggleFan}
        >
          <span className="glass-switch__label">Fan</span>
          <span className="glass-switch__track" aria-hidden="true">
            <span className="glass-switch__thumb" />
          </span>
        </button>
      </div>

      <div className="shell">
        <div className="room">
          <div className="stage">
            <div className="brand" aria-label="Namma Saloon">
              <div className="brand-board">
                <div className="brand-logo-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="brand-logo"
                    src="/logo.png"
                    alt="Namma Saloon — ನಮ್ಮ ಸಲೂನ್ logo, ESTD 1940"
                    width={1255}
                    height={763}
                    draggable={false}
                  />
                </div>
                <p className="brand-tag">ನಮ್ಮ ಊರು · ನಮ್ಮ ಸಲೂನ್</p>
              </div>
            </div>
          </div>

          <div className="dock">
            {listeners > 0 ? (
              <p className="listening" aria-live="polite">
                <span className="listening-dot" aria-hidden="true" />
                {listeners} listening now
              </p>
            ) : null}
            <div className="pill" role="region" aria-label="Now playing">
              <div
                className={`disc${playing ? " is-playing" : ""}`}
                style={
                  {
                    "--progress": `${(seek / 1000) * 100}%`,
                  } as CSSProperties
                }
                aria-hidden="true"
              >
                <div className="disc-ring">
                  <div className="disc-face">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" src={coverSrc} />
                    <span className="disc-sheen" />
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
                    const d = audioRef.current?.duration || 0;
                    setCur(fmt((v / 1000) * d));
                  }}
                  onChange={(e) => {
                    scrubbingRef.current = false;
                    const audio = audioRef.current;
                    if (audio && Number.isFinite(audio.duration)) {
                      audio.currentTime =
                        (Number(e.target.value) / 1000) * audio.duration;
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
    </>
  );
}
