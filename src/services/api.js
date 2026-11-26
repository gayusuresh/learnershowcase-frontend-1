import { API_BASE } from "../config/index.js";

// Single place for every backend call.
export const api = (path, opt = {}) =>
  fetch(API_BASE + "/api" + path, {
    cache: "no-store",
    ...opt,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + (localStorage.token || "") },
    body: opt.body && JSON.stringify(opt.body),
  }).then(async (r) => {
    if (r.status === 204) return null;
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "Request failed");
    return d;
  });

export const getList = (type, params = {}) => {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
  return api(`/${type}?${qs}`).then((d) => (Array.isArray(d) ? d : []));
};
export const getMeta = () => api("/meta/courses");

// Photo goes straight to Cloudinary using a signature from our server
export async function uploadPhoto(file) {
  const s = await api("/admin/upload-signature");
  const fd = new FormData();
  fd.append("file", file); fd.append("api_key", s.apiKey); fd.append("timestamp", s.timestamp);
  fd.append("folder", s.folder); fd.append("signature", s.signature);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, { method: "POST", body: fd });
  const d = await r.json();
  if (!d.secure_url) throw new Error("Photo upload failed");
  return d.secure_url;
}
