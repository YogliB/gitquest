import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useStore } from './store'
import './styles/global.css.ts'

export function App() {
  const currentStyle = useStore(s => s.currentStyle)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentStyle)
  }, [currentStyle])

  return <Outlet />
}
