import type { Meta, StoryObj } from "@storybook/react-vite";
import { LandingHeader } from "./LandingHeader";

const meta = {
  title: "Organisms/LandingHeader",
  component: LandingHeader,
  parameters: { layout: "padded" },
} satisfies Meta<typeof LandingHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
