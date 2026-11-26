import { useEffect, useState } from "react";
import { getList } from "../services/api.js";

// Loads a section; retries while a sleeping free-tier server wakes up. Returns null while loading.
export function useList(type, params) {
  const [items, setItems] = useState(null);
  const key = JSON.stringify(params);
  useEffect(() => {
    let off = false;
    setItems(null);
    const go = async (n = 1) => {
      try {
        const d = await getList(type, params);
        if (!off) setItems(d);
      } catch {
        if (off) return;
        n < 4 ? setTimeout(() => go(n + 1), 5000) : setItems([]);
      }
    };
    go();
    return () => { off = true; };
  }, [type, key]);
  return items;
}
