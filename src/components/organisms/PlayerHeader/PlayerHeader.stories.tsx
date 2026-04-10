import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { PlayerHeader } from "./PlayerHeader";

const meta = {
  title: "Organisms/PlayerHeader",
  component: PlayerHeader,
  parameters: { layout: "fullscreen" },
  args: { onBack: fn() },
} satisfies Meta<typeof PlayerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { owner: "facebook", repo: "react", commitCount: 142 },
};

export const LongNames: Story = {
  args: {
    owner: "anthropics",
    repo: "anthropic-sdk-python",
    commitCount: 1024,
  },
};
