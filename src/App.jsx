import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CropLibrary from './pages/CropLibrary'
import Community from './pages/Community'
import MandiRates from './pages/MandiRates'
import Transport from './pages/Transport'
import AIAssistant from './pages/AIAssistant'
import About from './pages/About'

function App() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/crops" element={<CropLibrary />} />
          <Route path="/community" element={<Community />} />
          <Route path="/mandi-rates" element={<MandiRates />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default App
