import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { PopularReposGrid } from "./PopularReposGrid";

const meta = {
  title: "Organisms/PopularReposGrid",
  component: PopularReposGrid,
  parameters: { layout: "padded" },
  args: { onSelect: fn() },
} satisfies Meta<typeof PopularReposGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
