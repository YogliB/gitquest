import { createHashRouter } from "react-router-dom";
import { App } from "./App";
import { LandingPage, PlayerPage } from "./components/pages";

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
