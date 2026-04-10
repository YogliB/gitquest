import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PlayerPage } from "./PlayerPage";
import { useStore } from "@/store";
import { mockAnalysis, mockCommits } from "@/stories/mockData";

const withRouter = (owner: string, repo: string) =>
  function RouterDecorator(Story: () => JSX.Element) {
    return (
      <MemoryRouter initialEntries={[`/${owner}/${repo}`]}>
        <Routes>
          <Route path="/:owner/:repo" element={<Story />} />
        </Routes>
      </MemoryRouter>
    );
  };

const meta = {
  title: "Pages/PlayerPage",
  component: PlayerPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PlayerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  decorators: [
    (Story) => {
      useStore.setState({
        isLoading: true,
        loadError: null,
        commits: [],
        analysis: null as any,
      });
      return withRouter("facebook", "react")(Story);
    },
  ],
};

export const LoadError: Story = {
  decorators: [
    (Story) => {
      useStore.setState({
        isLoading: false,
        loadError: "API rate limit exceeded. Add a GitHub token in settings to continue.",
        commits: [],
        analysis: null as any,
      });
      return withRouter("facebook", "react")(Story);
    },
  ],
};

export const Loaded: Story = {
  decorators: [
    (Story) => {
      useStore.setState({
        isLoading: false,
        loadError: null,
        commits: mockCommits,
        analysis: mockAnalysis,
      });
      return withRouter("facebook", "react")(Story);
    },
  ],
};
