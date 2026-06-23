import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatContainer from './components/ChatContainer';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
