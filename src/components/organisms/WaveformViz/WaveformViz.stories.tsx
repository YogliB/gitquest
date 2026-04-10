import type { Meta, StoryObj } from "@storybook/react-vite";
import { WaveformViz } from "./WaveformViz";
import { mockAnalysis } from "@/stories/mockData";

const meta = {
  title: "Organisms/WaveformViz",
  component: WaveformViz,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WaveformViz>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paused: Story = {
  args: { analysis: mockAnalysis, isPlaying: false, effectiveBpm: 120 },
};

export const Playing: Story = {
  args: { analysis: mockAnalysis, isPlaying: true, effectiveBpm: 120 },
};

export const HighBPM: Story = {
  args: { analysis: mockAnalysis, isPlaying: true, effectiveBpm: 180 },
};

export const SlowBPM: Story = {
  args: { analysis: mockAnalysis, isPlaying: true, effectiveBpm: 60 },
};
