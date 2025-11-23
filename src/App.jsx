
import { Routes, Route } from 'react-router-dom'
import HomeView from './views/HomeView'
import Navbar from './components/Navbar/Navbar'

function App() {
  return (
    <div className="app-container">
    <Navbar /> 
      <Routes>
        <Route path="/" element={<HomeView />} />
        
        {/* Rutas futuras */}
        {/* <Route path="/login" element={<LoginView />} /> */}
        {/* <Route path="/movie/:id" element={<MovieDetailView />} /> */}
      </Routes>
    </div>
  )
}

export default App