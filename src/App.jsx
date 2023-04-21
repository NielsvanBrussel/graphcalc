import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Equations from './Equations'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Equations />
    </>
  )
}

export default App
