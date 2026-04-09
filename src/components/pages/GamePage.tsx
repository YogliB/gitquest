import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Style } from "@/types";
import { useStore } from "@/store";
import { fetchRepoInfo, fetchCommits, analyzeCommits } from "@/lib/github";
import { storyEngine } from "@/lib/story-engine";
import { musicEngine } from "@/lib/music-engine";
import { storage } from "@/lib/storage";
import { LoadingTemplate } from "@/components/templates/LoadingTemplate/LoadingTemplate";
import { GameTemplate } from "@/components/templates/GameTemplate/GameTemplate";

const LOADING_FACTS: Record<Style, string[]> = {
  dnd: [
    "Consulting the ancient commit scrolls...",
    "Summoning the spirit of git blame...",
    "Translating merge conflicts into orcish...",
    "Polishing the enchanted diff viewer...",
    "Awakening the repository dragon...",
  ],
  scifi: [
    "Scanning commit matrix for anomalies...",
    "Compiling narrative subroutines...",
    "Calibrating temporal diff engine...",
    "Establishing uplink to git core...",
    "Quantum-entangling branch histories...",
  ],
  horror: [
    "Something stirs in the commit history...",
    "The old ones who wrote this code are listening...",
    "Reading the forbidden pull requests...",
    "The repository remembers everything...",
    "Do not look directly at the blame output...",
  ],
};

export function GamePage() {
  const navigate = useNavigate();
  const { owner, repo, style } = useParams<{ owner: string; repo: string; style: string }>();

  const {
    gameState,
    setGameState,
    isGenerating,
    setIsGenerating,
    githubToken,
    currentStyle,
    setCurrentStyle,
    isPlaying,
    volume,
    setIsPlaying,
    setVolume,
    musicStarted,
    setMusicStarted,
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [heroName, setHeroName] = useState("Hero");
  const initialized = useRef(false);

  const validStyle = (style as Style) || "dnd";

  useEffect(() => {
    if (!owner || !repo || !style) {
      navigate("/");
      return;
    }
    if (initialized.current) return;
    initialized.current = true;

    setCurrentStyle(validStyle);

    const run = async () => {
      try {
        const facts = LOADING_FACTS[validStyle] || LOADING_FACTS.dnd;
        let factIdx = 0;
        const factInterval = setInterval(() => {
          setLoadingMessage(facts[factIdx % facts.length]);
          factIdx++;
        }, 2500);

        setLoadingProgress(5);
        setLoadingMessage("Fetching repository info...");
        const repoInfo = await fetchRepoInfo(owner, repo, githubToken || null);
        setLoadingProgress(20);

        setLoadingMessage("Loading commit history...");
        const commits = await fetchCommits(owner, repo, githubToken || null, 80);
        setLoadingProgress(50);

        setLoadingMessage("Analyzing the chronicles...");
        const analysis = analyzeCommits(commits);
        setLoadingProgress(65);

        // Extract hero name from top contributor
        const topAuthor = analysis.topContributors?.[0]?.name;
        if (topAuthor) setHeroName(topAuthor.split(" ")[0]);

        setLoadingMessage("Starting the music...");
        await musicEngine.init(validStyle, analysis);
        setLoadingProgress(75);

        // Wire up story engine callbacks
        storyEngine.onSceneReady = (scene, commit) => {
          setIsGenerating(false);
        };

        setLoadingMessage("Beginning your quest...");
        const initialState = await storyEngine.startGame(
          { owner, repo },
          validStyle,
          commits,
          analysis,
        );
        setLoadingProgress(100);

        clearInterval(factInterval);
        setGameState(initialState);
        setLoading(false);
      } catch (err: any) {
        console.error("GamePage init error:", err);
        navigate(`/${owner}/${repo}?error=${encodeURIComponent(err.message || "Failed to load")}`);
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoice = async (index: number) => {
    if (!gameState || isGenerating) return;
    setIsGenerating(true);
    await storyEngine.makeChoice(index);
    if (storyEngine.state) {
      setGameState({ ...storyEngine.state });
    }
    setIsGenerating(false);
  };

  const handleCustomChoice = async (text: string) => {
    if (!gameState || isGenerating) return;
    setIsGenerating(true);
    await storyEngine.makeChoice(text);
    if (storyEngine.state) {
      setGameState({ ...storyEngine.state });
    }
    setIsGenerating(false);
  };

  const handleSave = () => {
    storyEngine.saveGame("manual");
  };

  const handleLoadGame = () => {
    if (storyEngine.state) {
      setGameState({ ...storyEngine.state });
    }
  };

  const handleMusicToggle = () => {
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

  if (loading || !gameState) {
    return (
      <LoadingTemplate style={validStyle} progress={loadingProgress} message={loadingMessage} />
    );
  }

  return (
    <GameTemplate
      owner={owner!}
      repo={repo!}
      gameState={gameState}
      heroName={heroName}
      isGenerating={isGenerating}
      isPlaying={isPlaying}
      volume={volume}
      onChoice={handleChoice}
      onCustomChoice={handleCustomChoice}
      onSave={handleSave}
      onLoadGame={handleLoadGame}
      onMusicToggle={handleMusicToggle}
      onVolumeChange={handleVolumeChange}
    />
  );
}
