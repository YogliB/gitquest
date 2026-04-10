import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { RepoInputBar } from "./RepoInputBar";

const meta = {
  title: "Organisms/RepoInputBar",
  component: RepoInputBar,
  args: { onSubmit: fn() },
} satisfies Meta<typeof RepoInputBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { error: null, defaultValue: "" },
};

export const WithError: Story = {
  args: {
    error: "Please enter a valid GitHub repo (e.g. owner/repo or full URL)",
    defaultValue: "not-valid",
  },
};

export const Prefilled: Story = {
  args: { error: null, defaultValue: "facebook/react" },
};
