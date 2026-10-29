import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Intro from "./components/Intro.jsx";
import GlassDefs from "./components/GlassDefs.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SellerLanding from "./pages/SellerLanding.jsx";
import { startSmoothScroll, scrollToTop } from "./smoothScroll.js";

export default function App() {
  const { pathname } = useLocation();

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

  // smooth scrolling for the whole app
  useEffect(() => startSmoothScroll(), []);

  // every new page starts at the top
  useEffect(() => scrollToTop(), [pathname]);

  return (
    <>
      <GlassDefs />
      {!introDone ? (
        <Intro onDone={finishIntro} />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/seller" element={<SellerLanding />} />
        </Routes>
      )}
    </>
  );
}