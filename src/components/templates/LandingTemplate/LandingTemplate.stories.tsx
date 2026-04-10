import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { LandingTemplate } from "./LandingTemplate";

const meta = {
  title: "Templates/LandingTemplate",
  component: LandingTemplate,
  parameters: { layout: "fullscreen" },
  args: { onSubmit: fn(), onRepoSelect: fn() },
} satisfies Meta<typeof LandingTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { error: null },
};

export const WithError: Story = {
  args: {
    error: "Please enter a valid GitHub repo (e.g. owner/repo or full URL)",
  },
};
