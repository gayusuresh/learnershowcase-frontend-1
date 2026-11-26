import { useSearchParams } from "react-router-dom";
import { Card } from "../components/Card.jsx";
import { REGIONS, slug } from "../config/index.js";
import { useList } from "../hooks/useList.js";

export default function Section({ info, courses }) {
  const [params, setParams] = useSearchParams();
  const region = params.get("region") || "";
  const course = params.get("course") || "";
  const items = useList(info.path, { region, course });

  const set = (k, v) => {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next);
  };

  return (
    <>
      <div className="pagehead"><div className="wrap"><h1>{info.title}</h1><p>{info.sub}</p></div></div>
      <div className="wrap content">
        <div className="filters">
          <div className="chips" role="group" aria-label="Region">
            <button className={!region ? "on" : ""} onClick={() => set("region", "")}>All regions</button>
            {REGIONS.map((r) => (
              <button key={r} data-region={slug(r)} className={region === r ? "on" : ""} onClick={() => set("region", r)}>{r}</button>
            ))}
          </div>
          <select value={course} onChange={(e) => set("course", e.target.value)} aria-label="Course">
            <option value="">All courses</option>
            {courses.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        {items === null ? <p className="note">Loading… the server may take up to a minute to wake up.</p>
          : items.length === 0 ? <p className="note">Nothing here yet for this region and course. Try another filter.</p>
          : <div className="grid">{items.map((i) => <Card key={i._id} type={info.path} item={i} />)}</div>}
      </div>
    </>
  );
}
