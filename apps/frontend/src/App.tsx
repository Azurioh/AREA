import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import OtherPage from '@/pages/OtherPage';
import ProfilePage from '@/pages/Profile';
import { ApiProvider } from './contexts/ApiContext';

export default function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/other" element={<OtherPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}
