import { Route, Routes } from 'react-router-dom'
import CScaleLandingPage from './index.tsx'
import Results from './pages/Results.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CScaleLandingPage />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  )
}

export default App
