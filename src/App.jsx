import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomeView from "./views/HomeView/HomeView";
import Navbar from "./components/Navbar/Navbar";
import MovieDetailView from "./views/MovieDetailView/MovieDetailView";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/movie/:id" element={<MovieDetailView />} />

        {/* To implement future routes*/}
        {/* <Route path="/login" element={<LoginView />} /> */}
      </Routes>
    </div>
  );
}

export default App;
