import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report/:jobId" element={<Report />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
