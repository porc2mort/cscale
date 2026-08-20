import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Quiz from './pages/Quiz.jsx'
import Results from './pages/Results.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/" end>About</NavLink>
        <NavLink to="/quiz">Take the quiz</NavLink>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
