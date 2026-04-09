import { createHashRouter } from "react-router-dom";
import { App } from "./App";
import { LandingPage } from "./components/pages/LandingPage";
import { PlayerPage } from "./components/pages/PlayerPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: ":owner/:repo", element: <PlayerPage /> },
    ],
  },
]);
