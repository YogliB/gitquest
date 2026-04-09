import { createHashRouter } from 'react-router-dom'
import { App } from './App'
import { LandingPage } from './components/pages/LandingPage'
import { StylePage } from './components/pages/StylePage'
import { GamePage } from './components/pages/GamePage'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: ':owner/:repo', element: <StylePage /> },
      { path: ':owner/:repo/:style', element: <GamePage /> },
    ],
  },
])
