import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Intro from "./components/Intro.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  // Intro plays once per browser session
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
    } catch {
      /* ignore */
    }
    setIntroDone(true);
  };

  if (!introDone) return <Intro onDone={finishIntro} />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}