import type { Meta, StoryObj } from "@storybook/react-vite";
import { FromYourCodePanel } from "./FromYourCodePanel";
import { mockAnalysis, mockAnalysisMinor } from "@/stories/mockData";

const meta = {
  title: "Organisms/FromYourCodePanel",
  component: FromYourCodePanel,
  parameters: { layout: "padded" },
} satisfies Meta<typeof FromYourCodePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { analysis: mockAnalysis },
};

export const MinorScale: Story = {
  args: { analysis: mockAnalysisMinor },
};
