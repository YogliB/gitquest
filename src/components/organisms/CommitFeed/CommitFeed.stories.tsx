import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommitFeed } from "./CommitFeed";
import { mockCommits } from "@/stories/mockData";

const meta = {
  title: "Organisms/CommitFeed",
  component: CommitFeed,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CommitFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { commits: mockCommits },
};

export const Empty: Story = {
  args: { commits: [] },
};

export const SingleCommit: Story = {
  args: { commits: mockCommits.slice(0, 1) },
};
