import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "@/pages/Home"
import OtherPage from "@/pages/OtherPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other" element={<OtherPage />} />
      </Routes>
    </BrowserRouter>
  )
}