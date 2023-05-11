import { useState } from 'react'
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
