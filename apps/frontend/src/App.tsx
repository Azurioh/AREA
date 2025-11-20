import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import OtherPage from '@/pages/OtherPage';
import { ApiProvider } from './contexts/ApiContext';

export default function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/other" element={<OtherPage />} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}
