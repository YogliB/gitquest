import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { PlayerTemplate } from "./PlayerTemplate";
import {
  mockAnalysis,
  mockCommits,
  mockOverridesEmpty,
  mockOverridesPartial,
} from "@/stories/mockData";

const meta = {
  title: "Templates/PlayerTemplate",
  component: PlayerTemplate,
  parameters: { layout: "fullscreen" },
  args: {
    owner: "facebook",
    repo: "react",
    analysis: mockAnalysis,
    commits: mockCommits,
    volume: 0.6,
    overrides: mockOverridesEmpty,
    onPlayPause: fn(),
    onVolumeChange: fn(),
    onOverrideChange: fn(),
    onResetOverrides: fn(),
    onBack: fn(),
  },
} satisfies Meta<typeof PlayerTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paused: Story = {
  args: { isPlaying: false },
};

export const Playing: Story = {
  args: { isPlaying: true },
};

export const WithOverrides: Story = {
  args: { isPlaying: false, overrides: mockOverridesPartial },
};

export const FewCommits: Story = {
  args: { isPlaying: false, commits: mockCommits.slice(0, 3) },
};
