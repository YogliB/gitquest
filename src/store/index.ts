import { create } from "zustand";
import { createRepoSlice, type RepoSlice } from "./repoSlice";
import { createSettingsSlice, type SettingsSlice } from "./settingsSlice";
import { createMusicSlice, type MusicSlice } from "./musicSlice";

type Store = RepoSlice & SettingsSlice & MusicSlice;

export const useStore = create<Store>((set, _get, _api) => ({
  ...createRepoSlice(set as any),
  ...createSettingsSlice(set as any),
  ...createMusicSlice(set as any),
}));
