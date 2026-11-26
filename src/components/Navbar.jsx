import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SECTIONS, SHOW_ADMIN, SHOW_HOME, START } from "../config/index.js";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-nav">
      <div className="wrap bar2">
        <Link to={START} className="brand">Learner<span>Showcase</span></Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
        <div role="navigation" className={"menu" + (open ? " open" : "")} onClick={() => setOpen(false)}>
          {SHOW_HOME && <NavLink to="/" end>Home</NavLink>}
          {SECTIONS.map((s) => <NavLink key={s.path} to={`/${s.path}`}>{s.label}</NavLink>)}
          {SHOW_ADMIN && <NavLink to="/admin" className="cta">Login</NavLink>}
        </div>
      </div>
    </header>
  );
}
