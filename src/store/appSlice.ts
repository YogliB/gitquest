import type { Style } from '@/types'

export interface AppSlice {
  currentStyle: Style
  urlError: string | null
  setCurrentStyle: (style: Style) => void
  setUrlError: (msg: string | null) => void
}

export function createAppSlice(set: (fn: (state: AppSlice) => Partial<AppSlice>) => void): AppSlice {
  return {
    currentStyle: 'dnd',
    urlError: null,
    setCurrentStyle: (style) => set(() => ({ currentStyle: style })),
    setUrlError: (msg) => set(() => ({ urlError: msg })),
  }
}
