// Doppelt gesicherte Persistenz:
// 1. localStorage als primärer, synchroner Speicher (übersteht Reload,
//    Tab-/Browser-Schließen und Abstürze).
// 2. IndexedDB als Spiegel – falls localStorage je geleert wird (z. B. durch
//    aggressive Speicherbereinigung), werden die Daten beim nächsten Start
//    automatisch wiederhergestellt.
// 3. navigator.storage.persist() bittet den Browser, den Speicher als
//    dauerhaft zu markieren (schützt vor automatischer Räumung).

const DB_NAME = 'pokermentor';
const STORE = 'kv';
const KEY_PREFIX = 'pokermentor';

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

let dbPromise: Promise<IDBDatabase | null> | null = null;
function getDb() {
  if (!dbPromise) dbPromise = openDb();
  return dbPromise;
}

/** Wert in den IndexedDB-Spiegel schreiben (fire-and-forget). */
export function mirrorSet(key: string, value: string): void {
  getDb().then((db) => {
    if (!db) return;
    try {
      db.transaction(STORE, 'readwrite').objectStore(STORE).put(value, key);
    } catch {
      // Spiegel ist optional – Fehler still ignorieren
    }
  });
}

/** Wert aus dem Spiegel entfernen. */
export function mirrorDelete(key: string): void {
  getDb().then((db) => {
    if (!db) return;
    try {
      db.transaction(STORE, 'readwrite').objectStore(STORE).delete(key);
    } catch {
      // ignorieren
    }
  });
}

/** Alle gespiegelten Einträge lesen. */
function mirrorGetAll(): Promise<Record<string, string>> {
  return new Promise((resolve) => {
    getDb().then((db) => {
      if (!db) return resolve({});
      try {
        const store = db.transaction(STORE, 'readonly').objectStore(STORE);
        const keysReq = store.getAllKeys();
        const valsReq = store.getAll();
        let keys: IDBValidKey[] | null = null;
        let vals: unknown[] | null = null;
        const done = () => {
          if (keys && vals) {
            const out: Record<string, string> = {};
            keys.forEach((k, i) => {
              if (typeof k === 'string' && typeof vals![i] === 'string') out[k] = vals![i] as string;
            });
            resolve(out);
          }
        };
        keysReq.onsuccess = () => { keys = keysReq.result; done(); };
        valsReq.onsuccess = () => { vals = valsReq.result; done(); };
        keysReq.onerror = () => resolve({});
        valsReq.onerror = () => resolve({});
      } catch {
        resolve({});
      }
    });
  });
}

/**
 * Beim App-Start aufrufen: Ist localStorage leer (z. B. nach Speicherräumung),
 * aber der Spiegel enthält Daten, werden sie wiederhergestellt.
 * Gibt true zurück, wenn etwas wiederhergestellt wurde.
 */
export async function restoreFromMirrorIfNeeded(): Promise<boolean> {
  try {
    // Gibt es bereits App-Daten in localStorage? Dann nichts tun.
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(KEY_PREFIX)) return false;
    }
  } catch {
    return false;
  }
  const mirrored = await mirrorGetAll();
  const keys = Object.keys(mirrored).filter((k) => k.startsWith(KEY_PREFIX));
  if (keys.length === 0) return false;
  try {
    for (const k of keys) localStorage.setItem(k, mirrored[k]);
    return true;
  } catch {
    return false;
  }
}

/** Browser bitten, den Speicher dauerhaft zu behalten. */
export function requestPersistentStorage(): void {
  try {
    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }
  } catch {
    // optional
  }
}

/** Schreibt in localStorage UND in den Spiegel. */
export function durableSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage voll/gesperrt – Spiegel versucht es trotzdem
  }
  mirrorSet(key, value);
}

/** Löscht aus localStorage UND dem Spiegel. */
export function durableDelete(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignorieren
  }
  mirrorDelete(key);
}
