// API address: empty = same site (Vite proxy locally, Netlify _redirects in production)
export const API_BASE = import.meta.env.VITE_API_URL || "";

// Feature switches for demos. For a projects-only demo: VISIBLE = ["projects"], SHOW_HOME = false.
export const VISIBLE = ["projects", "testimonials", "placements", "achievements"];
export const SHOW_HOME = true;
export const SHOW_ADMIN = true;

const ALL = [
  { path: "projects", label: "Projects", title: "Learner projects", sub: "Real problems, built by our learners." },
  { path: "testimonials", label: "Testimonials", title: "Learner testimonials", sub: "Their journey, mentors and course experience." },
  { path: "placements", label: "Placements", title: "Placement success stories", sub: "Learners who landed roles after our courses." },
  { path: "achievements", label: "Achievements", title: "Learner achievements", sub: "Hackathons, certifications and milestones." },
];
export const SECTIONS = ALL.filter((s) => VISIBLE.includes(s.path));
export const START = SHOW_HOME ? "/" : "/" + SECTIONS[0].path;
export const REGIONS = ["Kerala", "Tamil Nadu", "Telugu"];
export const slug = (r) => r.toLowerCase().replace(" ", "-");
