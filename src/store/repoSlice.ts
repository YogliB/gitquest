import type { Commit, Analysis, Style } from "@/types";

export interface RepoSlice {
  commits: Commit[];
  analysis: Analysis | null;
  currentStyle: Style;
  urlError: string | null;
  isLoading: boolean;
  loadError: string | null;
  setCommits: (commits: Commit[]) => void;
  setAnalysis: (analysis: Analysis) => void;
  setCurrentStyle: (style: Style) => void;
  setUrlError: (msg: string | null) => void;
  setIsLoading: (val: boolean) => void;
  setLoadError: (msg: string | null) => void;
}

export function createRepoSlice(
  set: (fn: (state: RepoSlice) => Partial<RepoSlice>) => void,
): RepoSlice {
  return {
    commits: [],
    analysis: null,
    currentStyle: "dnd",
    urlError: null,
    isLoading: false,
    loadError: null,
    setCommits: (commits) => set(() => ({ commits })),
    setAnalysis: (analysis) => set(() => ({ analysis })),
    setCurrentStyle: (style) => set(() => ({ currentStyle: style })),
    setUrlError: (msg) => set(() => ({ urlError: msg })),
    setIsLoading: (val) => set(() => ({ isLoading: val })),
    setLoadError: (msg) => set(() => ({ loadError: msg })),
  };
}
