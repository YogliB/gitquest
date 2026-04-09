import type { GameState, Commit, Analysis } from '@/types'

export interface GameSlice {
  gameState: GameState | null
  isGenerating: boolean
  commits: Commit[]
  analysis: Analysis | null
  setGameState: (state: GameState) => void
  updateGameState: (partial: Partial<GameState>) => void
  setIsGenerating: (val: boolean) => void
  setCommits: (commits: Commit[]) => void
  setAnalysis: (analysis: Analysis) => void
}

export function createGameSlice(set: (fn: (state: GameSlice) => Partial<GameSlice>) => void): GameSlice {
  return {
    gameState: null,
    isGenerating: false,
    commits: [],
    analysis: null,
    setGameState: (state) => set(() => ({ gameState: state })),
    updateGameState: (partial) =>
      set((s) => ({
        gameState: s.gameState ? { ...s.gameState, ...partial } : null,
      })),
    setIsGenerating: (val) => set(() => ({ isGenerating: val })),
    setCommits: (commits) => set(() => ({ commits })),
    setAnalysis: (analysis) => set(() => ({ analysis })),
  }
}
