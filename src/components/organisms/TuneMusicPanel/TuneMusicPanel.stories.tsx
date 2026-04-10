import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TuneMusicPanel } from "./TuneMusicPanel";
import {
  mockAnalysis,
  mockOverridesEmpty,
  mockOverridesPartial,
  mockOverridesFull,
} from "@/stories/mockData";

const meta = {
  title: "Organisms/TuneMusicPanel",
  component: TuneMusicPanel,
  parameters: { layout: "padded" },
  args: { analysis: mockAnalysis, onOverrideChange: fn(), onReset: fn() },
} satisfies Meta<typeof TuneMusicPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { overrides: mockOverridesEmpty },
};

export const WithOverrides: Story = {
  args: { overrides: mockOverridesPartial },
};

export const FullOverrides: Story = {
  args: { overrides: mockOverridesFull },
};
