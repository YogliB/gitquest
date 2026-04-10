import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { fetchCommits, analyzeCommits } from "@/lib/github";
import { musicEngine } from "@/lib/music-engine";
import { PlayerTemplate } from "@/components/templates";
import type { MusicOverrides } from "@/types";

export function PlayerPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();

  const analysis = useStore((s) => s.analysis);
  const commits = useStore((s) => s.commits);
  const overrides = useStore((s) => s.overrides);
  const isLoading = useStore((s) => s.isLoading);
  const loadError = useStore((s) => s.loadError);
  const setCommits = useStore((s) => s.setCommits);
  const setAnalysis = useStore((s) => s.setAnalysis);
  const setOverrides = useStore((s) => s.setOverrides);
  const resetOverrides = useStore((s) => s.resetOverrides);
  const setIsLoading = useStore((s) => s.setIsLoading);
  const setLoadError = useStore((s) => s.setLoadError);

  const isPlaying = useStore((s) => s.isPlaying);
  const volume = useStore((s) => s.volume);
  const musicStarted = useStore((s) => s.musicStarted);
  const setIsPlaying = useStore((s) => s.setIsPlaying);
  const setVolume = useStore((s) => s.setVolume);
  const setMusicStarted = useStore((s) => s.setMusicStarted);

  const githubToken = useStore((s) => s.githubToken);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!owner || !repo) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError(null);
      setCommits([]);
      setAnalysis(null as any);
      setMusicStarted(false);
      setIsPlaying(false);
      musicEngine.dispose();

      try {
        const fetched = await fetchCommits(owner!, repo!, githubToken || null);
        if (cancelled) return;
        const analyzed = analyzeCommits(fetched);
        setCommits(fetched);
        setAnalysis(analyzed);
        await musicEngine.init(analyzed);
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

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    musicEngine.setVolume(v);
  };

  const handleOverrideChange = (newOverrides: MusicOverrides) => {
    setOverrides(newOverrides);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!analysis) return;
      const wasPlaying = musicEngine.isPlaying;
      musicEngine.dispose();
      setIsPlaying(false);
      await musicEngine.init(analysis, newOverrides);
      if (wasPlaying) {
        musicEngine.play();
        setIsPlaying(true);
      }
    }, 300);
  };

  const handleResetOverrides = async () => {
    resetOverrides();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!analysis) return;
    const wasPlaying = musicEngine.isPlaying;
    musicEngine.dispose();
    setIsPlaying(false);
    await musicEngine.init(analysis);
    if (wasPlaying) {
      musicEngine.play();
      setIsPlaying(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-base-content/60">
          Loading {owner}/{repo}…
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
        <div className="max-w-md w-full flex flex-col gap-4">
          <div className="alert alert-error">
            <span>{loadError}</span>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate("/")}>
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <PlayerTemplate
      owner={owner!}
      repo={repo!}
      analysis={analysis}
      commits={commits}
      isPlaying={isPlaying}
      volume={volume}
      overrides={overrides}
      onPlayPause={handlePlayPause}
      onVolumeChange={handleVolumeChange}
      onOverrideChange={handleOverrideChange}
      onResetOverrides={handleResetOverrides}
      onBack={() => navigate("/")}
    />
  );
}
