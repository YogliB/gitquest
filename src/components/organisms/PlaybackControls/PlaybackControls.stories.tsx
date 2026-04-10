import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { PlaybackControls } from "./PlaybackControls";

const meta = {
  title: "Organisms/PlaybackControls",
  component: PlaybackControls,
  args: { onPlayPause: fn(), onVolumeChange: fn() },
} satisfies Meta<typeof PlaybackControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paused: Story = {
  args: { isPlaying: false, isDisabled: false, volume: 0.6 },
};

export const Playing: Story = {
  args: { isPlaying: true, isDisabled: false, volume: 0.6 },
};

export const Disabled: Story = {
  args: { isPlaying: false, isDisabled: true, volume: 0.6 },
};

export const LowVolume: Story = {
  args: { isPlaying: true, isDisabled: false, volume: 0.1 },
};
