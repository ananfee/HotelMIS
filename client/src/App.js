import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import RoomsPage from './pages/RoomsPage';
import BookingsPage from './pages/BookingsPage';
import GuestsPage from './pages/GuestsPage';
import ArchivePage from './pages/ArchivePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/archive" element={<ArchivePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

