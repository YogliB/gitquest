export interface MusicSlice {
  isPlaying: boolean
  volume: number
  musicStarted: boolean
  setIsPlaying: (val: boolean) => void
  setVolume: (val: number) => void
  setMusicStarted: (val: boolean) => void
}

export function createMusicSlice(set: (fn: (state: MusicSlice) => Partial<MusicSlice>) => void): MusicSlice {
  return {
    isPlaying: false,
    volume: 0.6,
    musicStarted: false,
    setIsPlaying: (val) => set(() => ({ isPlaying: val })),
    setVolume: (val) => set(() => ({ volume: val })),
    setMusicStarted: (val) => set(() => ({ musicStarted: val })),
  }
}
