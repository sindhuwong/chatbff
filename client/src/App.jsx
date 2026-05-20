import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ApiPage from "./pages/ApiPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}
