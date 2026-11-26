import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/Card.jsx";
import { getList } from "../services/api.js";

const BLOCKS = [
  ["projects", "Featured projects", "Real problems, built from scratch by our learners."],
  ["placements", "Placement success stories", "Career switches and first jobs after our courses."],
  ["testimonials", "Learner voices", "The learning journey, in their own words."],
  ["achievements", "Achievements", "Hackathons, certifications and milestones."],
];
const REGIONS = [["Kerala", "kerala"], ["Tamil Nadu", "tamil-nadu"], ["Telugu", "telugu"]];
const EMPTY = { projects: [], placements: [], testimonials: [], achievements: [] };

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    Promise.all(BLOCKS.map(([t]) => getList(t)))
      .then((r) => setData(Object.fromEntries(BLOCKS.map(([t], i) => [t, Array.isArray(r[i]) ? r[i] : []]))))
      .catch(() => setData(EMPTY));
  }, []);

  const all = data ? Object.values(data).flat() : [];
  const inRegion = (name) => all.filter((i) => i.region === name).length;

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>What our learners build, say and become</h1>
          <p>Projects, success stories and achievements from learners across Kerala, Tamil Nadu and the Telugu states.</p>
          <div className="btns">
            <Link className="btn" to="/projects">Explore projects</Link>
            <Link className="btn ghost" to="/placements">Placement stories</Link>
          </div>
          <div className="stats">
            {BLOCKS.map(([t, label]) => (
              <div key={t}><b>{data ? data[t].length : "–"}</b><span>{t[0].toUpperCase() + t.slice(1)}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="head"><div><h2>Explore by region</h2><p>See what learners from each region have achieved.</p></div></div>
          <div className="regions">
            {REGIONS.map(([name, s]) => (
              <Link key={s} className="region" data-region={s} to={`/projects?region=${encodeURIComponent(name)}`}>
                <h3>{name}</h3><b>{data ? inRegion(name) : "–"}</b><span>stories and projects</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {BLOCKS.map(([t, title, sub], i) => (
        <section key={t} className={"block" + (i % 2 === 0 ? " alt" : "")}>
          <div className="wrap">
            <div className="head">
              <div><h2>{title}</h2><p>{sub}</p></div>
              <Link className="more" to={`/${t}`}>View all →</Link>
            </div>
            {!data ? <p className="note">Loading…</p>
              : data[t].length === 0 ? <p className="note">Nothing published yet.</p>
              : <div className="grid">{data[t].slice(0, 3).map((x) => <Card key={x._id} type={t} item={x} />)}</div>}
          </div>
        </section>
      ))}

      <section className="cta-band">
        <div className="wrap">
          <h2>Want your story featured here?</h2>
          <p>Talk to your batch coordinator or mentor to share your project, testimonial or placement.</p>
        </div>
      </section>
    </>
  );
}
