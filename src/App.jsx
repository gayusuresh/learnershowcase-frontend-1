import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import { SECTIONS, SHOW_ADMIN, SHOW_HOME, START } from "./config/index.js";
import Admin from "./pages/Admin.jsx";
import Home from "./pages/Home.jsx";
import Section from "./pages/Section.jsx";
import { getMeta } from "./services/api.js";

export default function App() {
  const [courses, setCourses] = useState([]);
  const { pathname } = useLocation();

  useEffect(() => {
    getMeta().then((m) => setCourses(m.courses || [])).catch(() => {});
  }, [pathname]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          {SHOW_HOME && <Route path="/" element={<Home />} />}
          {SECTIONS.map((s) => <Route key={s.path} path={`/${s.path}`} element={<Section info={s} courses={courses} />} />)}
          {SHOW_ADMIN && <Route path="/admin" element={<div className="wrap content"><Admin /></div>} />}
          <Route path="*" element={<Navigate to={START} replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
