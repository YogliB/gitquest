import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "@/store";

const meta = {
  title: "Organisms/ThemeToggle",
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SystemSelected: Story = {};

export const LightSelected: Story = {
  decorators: [
    (Story) => {
      useStore.setState({ colorTheme: "light" });
      return <Story />;
    },
  ],
};

export const DarkSelected: Story = {
  decorators: [
    (Story) => {
      useStore.setState({ colorTheme: "dark" });
      return <Story />;
    },
  ],
};
