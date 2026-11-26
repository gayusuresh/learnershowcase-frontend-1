import { useEffect, useState } from "react";
import { api, uploadPhoto } from "../services/api.js";

const REGIONS = ["Kerala", "Tamil Nadu", "Telugu"];
// [name, label, kind, options]
const COMMON = [
  ["learnerName", "Learner name"], ["course", "Course"], ["batch", "Batch"],
  ["region", "Region", "select", REGIONS], ["photoUrl", "Learner photo", "photo"],
  ["verifiedBy", "Verified by (mentor)"], ["consent", "Learner has given consent for photo, video and story", "bool"],
];
const FIELDS = {
  projects: [["title", "Project title"], ["problemStatement", "Problem statement", "area"], ["description", "Description", "area"],
    ["technologies", "Technologies (comma separated)", "list"], ["keyFeatures", "Key features (comma separated)", "list"],
    ["githubUrl", "GitHub URL"], ["liveUrl", "Live demo URL"], ["videoUrl", "Video URL"]],
  testimonials: [["quote", "Testimonial", "area"], ["mentorSupport", "Mentor support", "area"], ["feedback", "Overall feedback", "area"],
    ["journey", "Learning journey", "area"], ["videoUrl", "Video URL"]],
  placements: [["company", "Company"], ["designation", "Designation"], ["previousBackground", "Previous background"],
    ["journey", "Placement journey", "area"], ["skills", "Skills learned (comma separated)", "list"], ["videoUrl", "Video URL"]],
  achievements: [["title", "Title"], ["type", "Type", "select", ["Certification", "Hackathon", "Award", "Milestone"]],
    ["description", "Description", "area"]],
};

function Login({ onDone }) {
  const [role, setRole] = useState("coordinator");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const go = async (e) => {
    e.preventDefault();
    try {
      const d = await api("/auth/login", { method: "POST", body: { role, password } });
      localStorage.token = d.token; localStorage.role = d.role; onDone(d.role);
    } catch (x) { setErr(x.message); }
  };
  return (
    <form className="panel narrow" onSubmit={go}>
      <h2>Log in to manage content</h2>
      <label>Role<select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="coordinator">Mentor / coordinator</option><option value="admin">Admin</option></select></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {err && <p className="err">{err}</p>}
      <button className="primary">Log in</button>
    </form>
  );
}

function Manager({ role, onLogout }) {
  const isAdmin = role === "admin";
  const [type, setType] = useState("projects");
  const [status, setStatus] = useState(isAdmin ? "pending" : "");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const fields = [...COMMON, ...FIELDS[type]];

  const load = () => api(`/admin/${type}${status ? `?status=${status}` : ""}`).then(setItems)
    .catch((e) => (/log in/i.test(e.message) ? onLogout() : setMsg(e.message)));
  useEffect(() => { load(); setForm(null); }, [type, status]);

  const blank = () => setForm({ region: "Kerala", consent: false, status: "published", ...(type === "achievements" && { type: "Milestone" }) });
  const edit = (it) => setForm({ ...it, ...Object.fromEntries(fields.filter((f) => f[2] === "list").map(([n]) => [n, (it[n] || []).join(", ")])) });
  const set = (n, v) => setForm((f) => ({ ...f, [n]: v }));

  const save = async (e) => {
    e.preventDefault(); setMsg("");
    if (/^(file:|[a-zA-Z]:[\\/])/.test(form.photoUrl || "")) return setMsg("Photo must be an uploaded image or a link starting with / or https://, not a path on your computer.");
    const body = { ...form };
    fields.filter((f) => f[2] === "list").forEach(([n]) => (body[n] = String(form[n] || "").split(",").map((s) => s.trim()).filter(Boolean)));
    try {
      await api(form._id ? `/admin/${type}/${form._id}` : `/admin/${type}`, { method: form._id ? "PUT" : "POST", body });
      setMsg(isAdmin ? "Saved." : "Submitted for admin approval."); setForm(null); load();
    } catch (x) { setMsg(x.message); }
  };
  const setStatusOf = (it, s) => api(`/admin/${type}/${it._id}`, { method: "PUT", body: { status: s } }).then(load);
  const remove = (it) => confirm("Delete this entry permanently?") && api(`/admin/${type}/${it._id}`, { method: "DELETE" }).then(load);
  const pick = async (e) => {
    try { set("photoUrl", await uploadPhoto(e.target.files[0])); } catch (x) { setMsg(x.message); }
  };

  return (
    <div className="panel">
      <div className="bar"><strong>Signed in as {isAdmin ? "admin" : "coordinator"}</strong><button onClick={onLogout}>Log out</button></div>
      <div className="bar">
        {Object.keys(FIELDS).map((t) => <button key={t} className={t === type ? "on" : ""} onClick={() => setType(t)}>{t}</button>)}
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">All statuses</option><option value="pending">Pending approval</option>
          <option value="published">Published</option><option value="draft">Draft</option></select>
        <button className="primary" onClick={blank}>{isAdmin ? "Add new" : "Submit new entry"}</button>
      </div>
      {msg && <p className="note">{msg}</p>}

      {form && (
        <form className="editor" onSubmit={save}>
          {fields.map(([n, label, kind, opts]) => (
            <label key={n} className={kind === "area" ? "wide" : ""}>{label}
              {kind === "area" ? <textarea rows="3" value={form[n] || ""} onChange={(e) => set(n, e.target.value)} />
                : kind === "select" ? <select value={form[n] || ""} onChange={(e) => set(n, e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
                : kind === "bool" ? <input type="checkbox" checked={!!form[n]} onChange={(e) => set(n, e.target.checked)} />
                : kind === "photo" ? <span><input type="file" accept="image/*" onChange={pick} />
                    <input placeholder="or paste an image URL" value={form[n] || ""} onChange={(e) => set(n, e.target.value)} /></span>
                : <input value={form[n] || ""} required={["learnerName", "course", "title", "company"].includes(n)} onChange={(e) => set(n, e.target.value)} />}
            </label>
          ))}
          {isAdmin && <>
            <label>Status<select value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">Draft</option><option value="pending">Pending</option><option value="published">Published</option></select></label>
            <label>Feature on homepage<input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} /></label>
          </>}
          <div className="wide"><button className="primary">Save</button> <button type="button" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}

      <ul className="rows">
        {items.length === 0 && <li className="note">No entries with this filter.</li>}
        {items.map((it) => (
          <li key={it._id}>
            <span><strong>{it.title || it.company || it.quote?.slice(0, 60) || it.learnerName}</strong> {it.learnerName}, {it.course}, {it.region}
              <em className={"st " + it.status}>{it.status}</em></span>
            {isAdmin && <span className="acts">
              {it.status !== "published" && <button onClick={() => setStatusOf(it, "published")}>Approve</button>}
              {it.status === "published" && <button onClick={() => setStatusOf(it, "draft")}>Unpublish</button>}
              <button onClick={() => edit(it)}>Edit</button><button onClick={() => remove(it)}>Delete</button></span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Admin() {
  const [role, setRole] = useState(localStorage.role || "");
  const out = () => { localStorage.clear(); setRole(""); };
  return role ? <Manager role={role} onLogout={out} /> : <Login onDone={setRole} />;
}
