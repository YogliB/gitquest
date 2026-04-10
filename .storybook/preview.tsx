import type { Preview } from "@storybook/react-vite";
import "@/styles/global.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "DaisyUI theme",
      defaultValue: "gitquest-light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "gitquest-light", title: "Light" },
          { value: "gitquest-dark", title: "Dark" },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals["theme"] as string) ?? "gitquest-light";
      document.documentElement.setAttribute("data-theme", theme);
      return <Story />;
    },
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    layout: "centered",
  },
};

export default preview;
