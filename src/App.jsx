import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Intro from "./components/Intro.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

import SellerLanding from "./pages/SellerLanding.jsx"; // 1. Import seller landing
import './lib/liquid-glass/glass.css';

export default function App() {
  const [introDone, setIntroDone] = useState(() => {
    try {
      return sessionStorage.getItem("vyapari_intro") === "1";
    } catch {
      return false;
    }
  });

  const finishIntro = () => {
    try {
      sessionStorage.setItem("vyapari_intro", "1");
    } catch { /* ignore */ }
    setIntroDone(true);
  };

  if (!introDone) return <Intro onDone={finishIntro} />;

  return (
    <div className="app-container" style={{ minHeight: '100vh', position: 'relative' }}>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/seller" element={<SellerLanding />} /> {/* 2. Add route */}
        </Routes>
      </main>
    </div>
  );
}