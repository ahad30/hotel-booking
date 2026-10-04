import { useCallback, useSyncExternalStore } from "react";

// Small lists of hotel ids kept in localStorage (saved hotels, compare list,
// recently viewed). Every component using the same key stays in sync, and so
// do other open tabs.
const EVENT = "behb:collection";

const read = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const write = (key, ids) => {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* storage unavailable: the list just won't persist */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
};

// useSyncExternalStore needs a stable snapshot, so cache the parsed list per raw string.
const cache = new Map();
const snapshot = (key) => {
  let raw = "[]";
  try {
    raw = localStorage.getItem(key) || "[]";
  } catch {
    /* fall through with an empty list */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  const value = read(key);
  cache.set(key, { raw, value });
  return value;
};

const subscribe = (callback) => {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

const useCollection = (key, limit) => {
  const ids = useSyncExternalStore(subscribe, () => snapshot(key), () => []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id) => {
      const current = read(key);
      if (current.includes(id)) {
        write(key, current.filter((x) => x !== id));
        return false;
      }
      if (limit && current.length >= limit) return null;
      write(key, [...current, id]);
      return true;
    },
    [key, limit]
  );

  const remove = useCallback((id) => write(key, read(key).filter((x) => x !== id)), [key]);
  const clear = useCallback(() => write(key, []), [key]);

  return { ids, has, toggle, remove, clear, limit };
};

export const COMPARE_LIMIT = 3;

export const useSaved = () => useCollection("behb:saved");
export const useCompare = () => useCollection("behb:compare", COMPARE_LIMIT);

const RECENT_KEY = "behb:recent";
export const useRecentlyViewed = () => useCollection(RECENT_KEY);

// Most recent first, de-duplicated, capped at 8.
export const trackRecentlyViewed = (id) => {
  if (!id) return;
  write(RECENT_KEY, [id, ...read(RECENT_KEY).filter((x) => x !== id)].slice(0, 8));
};
