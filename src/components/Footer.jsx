import { Link } from "react-router-dom";
import { REGIONS, SECTIONS, SHOW_ADMIN, START } from "../config/index.js";

const first = "/" + SECTIONS[0].path;
export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Link to={START} className="brand">Learner<span style={{ color: "#7FA6FF" }}>Showcase</span></Link>
            <p>Celebrating what our learners build, say and become, across Kerala, Tamil Nadu and the Telugu states.</p>
          </div>
          <div><h4>Explore</h4>{SECTIONS.map((s) => <Link key={s.path} to={`/${s.path}`}>{s.label}</Link>)}</div>
          <div><h4>Regions</h4>{REGIONS.map((r) => <Link key={r} to={`${first}?region=${encodeURIComponent(r)}`}>{r}</Link>)}</div>
          {SHOW_ADMIN && <div><h4>Team</h4><Link to="/admin">Coordinator login</Link></div>}
        </div>
        <div className="copy">© {new Date().getFullYear()} Learner Showcase. All rights reserved.</div>
      </div>
    </footer>
  );
}
