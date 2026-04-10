import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { RepoCard } from "./RepoCard";
import { mockPopularRepo } from "@/stories/mockData";

const meta = {
  title: "Molecules/RepoCard",
  component: RepoCard,
  args: { onSelect: fn() },
} satisfies Meta<typeof RepoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { repo: mockPopularRepo },
};

export const LongDescription: Story = {
  args: {
    repo: {
      owner: "vercel",
      repo: "next.js",
      desc: "The React Framework for the Web — production-grade, full-stack, with built-in routing, SSR, SSG, API routes, and a massive ecosystem of plugins and adapters",
      stars: "125k",
      lang: "TypeScript",
    },
  },
};

export const ShortStats: Story = {
  args: {
    repo: {
      owner: "torvalds",
      repo: "linux",
      desc: "Linux kernel source tree",
      stars: "180k",
      lang: "C",
    },
  },
};
