import { create } from "zustand";
import { createAppSlice, type AppSlice } from "./appSlice";
import { createGameSlice, type GameSlice } from "./gameSlice";
import { createSettingsSlice, type SettingsSlice } from "./settingsSlice";
import { createMusicSlice, type MusicSlice } from "./musicSlice";

type Store = AppSlice & GameSlice & SettingsSlice & MusicSlice;

export const useStore = create<Store>((set, get, api) => ({
  ...createAppSlice(set as any),
  ...createGameSlice(set as any),
  ...createSettingsSlice(set as any),
  ...createMusicSlice(set as any),
}));
