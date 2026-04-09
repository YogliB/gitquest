import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { fetchCommits, analyzeCommits } from "@/lib/github";
import { musicEngine } from "@/lib/music-engine";
import type { Style } from "@/types";
import * as styles from "./PlayerPage.css";

const STYLE_LABELS: Record<Style, string> = {
  dnd: "Fantasy",
  scifi: "Sci-Fi",
  horror: "Dark",
};

export function PlayerPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();

  const analysis = useStore((s) => s.analysis);
  const currentStyle = useStore((s) => s.currentStyle);
  const isLoading = useStore((s) => s.isLoading);
  const loadError = useStore((s) => s.loadError);
  const setCommits = useStore((s) => s.setCommits);
  const setAnalysis = useStore((s) => s.setAnalysis);
  const setCurrentStyle = useStore((s) => s.setCurrentStyle);
  const setIsLoading = useStore((s) => s.setIsLoading);
  const setLoadError = useStore((s) => s.setLoadError);

  const isPlaying = useStore((s) => s.isPlaying);
  const volume = useStore((s) => s.volume);
  const musicStarted = useStore((s) => s.musicStarted);
  const setIsPlaying = useStore((s) => s.setIsPlaying);
  const setVolume = useStore((s) => s.setVolume);
  const setMusicStarted = useStore((s) => s.setMusicStarted);

  const githubToken = useStore((s) => s.githubToken);

  useEffect(() => {
    if (!owner || !repo) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError(null);
      setCommits([]);
      setAnalysis(null);
      setMusicStarted(false);
      setIsPlaying(false);
      musicEngine.dispose();

      try {
        const fetched = await fetchCommits(owner!, repo!, githubToken || null);
        if (cancelled) return;
        const analyzed = analyzeCommits(fetched);
        setCommits(fetched);
        setAnalysis(analyzed);
        await musicEngine.init(currentStyle, analyzed);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Failed to load repository");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, repo]);

  useEffect(() => {
    return () => {
      musicEngine.dispose();
    };
  }, []);

  const handleStyleChange = async (style: Style) => {
    setCurrentStyle(style);
    if (analysis) {
      const wasPlaying = isPlaying;
      musicEngine.dispose();
      setIsPlaying(false);
      setMusicStarted(false);
      await musicEngine.init(style, analysis);
      if (wasPlaying) {
        musicEngine.play();
        setIsPlaying(true);
        setMusicStarted(true);
      }
    }
  };

  const handlePlayPause = () => {
    if (!musicStarted) {
      musicEngine.play();
      setMusicStarted(true);
      setIsPlaying(true);
    } else if (isPlaying) {
      musicEngine.pause();
      setIsPlaying(false);
    } else {
      musicEngine.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    musicEngine.setVolume(v);
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>
            Loading {owner}/{repo}…
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.page}>
        <div className={styles.errorWrap}>
          <p>{loadError}</p>
          <button className={styles.backBtn} onClick={() => navigate("/")}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 className={styles.repoTitle}>
          {owner}/{repo}
        </h1>
        {analysis && <span className={styles.commitCount}>{analysis.totalCommits} commits</span>}
      </header>

      <main className={styles.main}>
        <div className={styles.styleRow}>
          {(["dnd", "scifi", "horror"] as Style[]).map((s) => (
            <button
              key={s}
              className={`${styles.styleBtn} ${currentStyle === s ? styles.styleBtnActive : ""}`}
              onClick={() => handleStyleChange(s)}
            >
              {STYLE_LABELS[s]}
            </button>
          ))}
        </div>

        <div className={styles.player}>
          <button
            className={styles.playBtn}
            onClick={handlePlayPause}
            disabled={!analysis}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <div className={styles.volumeRow}>
            <span className={styles.volIcon}>🔊</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
              aria-label="Volume"
            />
          </div>
        </div>

        {analysis && (
          <div className={styles.stats}>
            {[
              { label: "BPM", value: analysis.music.bpm },
              { label: "Voices", value: analysis.music.voices },
              { label: "Mode", value: analysis.music.mode },
              { label: "Energy", value: `${Math.round(analysis.music.energy * 100)}%` },
              { label: "Complexity", value: `${Math.round(analysis.music.complexity * 100)}%` },
              { label: "Authors", value: analysis.authorCount },
            ].map(({ label, value }) => (
              <div key={label} className={styles.stat}>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statValue}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
