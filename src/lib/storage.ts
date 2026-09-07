// Doppelt gesicherte Persistenz:
// 1. localStorage als primärer, synchroner Speicher (übersteht Reload,
//    Tab-/Browser-Schließen und Abstürze).
// 2. IndexedDB als Spiegel – falls localStorage je geleert wird (z. B. durch
//    aggressive Speicherbereinigung), werden die Daten beim nächsten Start
//    automatisch wiederhergestellt.
// 3. navigator.storage.persist() bittet den Browser, den Speicher als
//    dauerhaft zu markieren (schützt vor automatischer Räumung).
//
// Wer führt, wenn beide etwas anderes sagen? Normalerweise localStorage — es
// wird zuerst geschrieben. Lehnt es einen Schreibvorgang aber ab (voll,
// gesperrt), dann steht dort ab diesem Moment der ältere Stand, und der
// Spiegel führt. Genau dafür gibt es die Marke `VORRANG`: Sie liegt im
// Spiegel, überlebt den Neustart und sorgt dafür, dass der ältere Stand den
// neueren nicht überschreibt (E-062).

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
 * Wenn `localStorage` einen Schreibvorgang ablehnt — voll, gesperrt —, ist der
 * Spiegel ab diesem Moment der **neuere** Stand. Diese Marke hält das fest.
 *
 * Sie liegt im Spiegel, nicht in `localStorage`: Dort war ja gerade kein Platz.
 * Und sie trägt bewusst **nicht** das Präfix der App, damit sie beim
 * Wiederherstellen nicht selbst als Datensatz zurückgeschrieben wird.
 */
const VORRANG = '__spiegel-fuehrt';

/** Was zuletzt galt — damit die Marke nur bei einem Wechsel geschrieben wird. */
let spiegelFuehrt = false;

function merkeVorrang(gelungen: boolean): void {
  if (gelungen === !spiegelFuehrt) return;
  spiegelFuehrt = !gelungen;
  if (spiegelFuehrt) mirrorSet(VORRANG, new Date().toISOString());
  else mirrorDelete(VORRANG);
}

/**
 * Beim App-Start aufrufen: Ist localStorage leer (z. B. nach Speicherräumung),
 * aber der Spiegel enthält Daten, werden sie wiederhergestellt.
 * Gibt true zurück, wenn etwas wiederhergestellt wurde.
 */
export async function restoreFromMirrorIfNeeded(): Promise<boolean> {
  const mirrored = await mirrorGetAll();
  const keys = Object.keys(mirrored).filter((k) => k.startsWith(KEY_PREFIX));

  /* Der Spiegel führt: Beim letzten Mal hat `localStorage` einen Schreibvorgang
     abgelehnt. Dann steht dort ein *älterer* Stand — und der ältere darf den
     neueren nicht überleben. Hier wird deshalb überschrieben, nicht ergänzt. */
  if (mirrored[VORRANG] !== undefined) {
    let zurueck = false;
    try {
      for (const k of keys) {
        if (localStorage.getItem(k) !== mirrored[k]) {
          localStorage.setItem(k, mirrored[k]);
          if (isProgressKey(k)) zurueck = true;
        }
      }
    } catch {
      /* Immer noch kein Platz. Die Marke bleibt stehen, der Spiegel bleibt der
         wahre Stand, und der nächste Start versucht es wieder. */
      spiegelFuehrt = true;
      return false;
    }
    mirrorDelete(VORRANG);
    spiegelFuehrt = false;
    return zurueck;
  }

  try {
    // Entscheidend ist allein, ob der LERNFORTSCHRITT noch da ist. Nebensachen
    // wie die Sprachwahl oder ein gespeichertes Chip-Setup dürfen die
    // Wiederherstellung nicht blockieren – genau das ist früher passiert:
    // Nach einer Speicherräumung legte die App beim Start sofort wieder einen
    // Sprach-Schlüssel an, und der Fortschritt galt fälschlich als vorhanden.
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && isProgressKey(k)) return false;
    }
  } catch {
    return false;
  }
  // Nur fehlende Schlüssel zurückschreiben; vorhandene (z. B. eine gerade
  // getroffene Sprachwahl) bleiben unangetastet.
  if (keys.length === 0) return false;
  let restored = false;
  try {
    for (const k of keys) {
      if (localStorage.getItem(k) === null) {
        localStorage.setItem(k, mirrored[k]);
        if (isProgressKey(k)) restored = true;
      }
    }
    return restored;
  } catch {
    return false;
  }
}

/** Schlüssel, die echten Lernfortschritt enthalten (Profil-Index und Profildaten). */
export function isProgressKey(key: string): boolean {
  return (
    key === 'pokermentor-profiles-v1' || // Profil-Index
    key.startsWith('pokermentor-data-') || // Fortschritt je Profil
    key === 'pokermentor-v1' // Altbestand vor dem Profilsystem
  );
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

/**
 * Schreibt in localStorage UND in den Spiegel.
 *
 * Gibt zurück, ob `localStorage` den Wert genommen hat. `false` heißt: Der
 * Speicher ist voll oder gesperrt, im Spiegel steht ab jetzt der neuere Stand
 * — und die Nutzerin sollte das erfahren, statt es beim nächsten Start zu
 * bemerken.
 */
export function durableSet(key: string, value: string): boolean {
  let gelungen = true;
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage voll/gesperrt – Spiegel versucht es trotzdem
    gelungen = false;
  }
  mirrorSet(key, value);
  merkeVorrang(gelungen);
  return gelungen;
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

/**
 * Alles, was diese App auf dem Gerät abgelegt hat — für die Notsicherung
 * im Fehlerbildschirm. Die geht bewusst nicht über `exportJson()`: Wenn die
 * App abgestürzt ist, ist ihr Zustand womöglich genau das Problem.
 */
export function alleGespeichertenDaten(): Record<string, string> {
  const alles: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(KEY_PREFIX)) alles[k] = localStorage.getItem(k) ?? '';
    }
  } catch {
    // Speicher gesperrt – dann gibt es eben nichts zu sichern.
  }
  return alles;
}

/**
 * Der letzte Ausweg: alles löschen, was diese App gespeichert hat —
 * einschließlich des Spiegels, der sonst beim nächsten Start genau die
 * Daten zurückholte, die den Absturz ausgelöst haben.
 *
 * Das Warten am Ende ist der entscheidende Teil: `deleteDatabase` wird
 * *blockiert*, solange noch eine Verbindung offen ist. Wer danach sofort neu
 * lädt, startet ein Wettrennen zwischen dem ausstehenden Löschen und
 * `restoreFromMirrorIfNeeded()` — und verliert es womöglich.
 */
export async function loescheAllesVonUns(): Promise<void> {
  try {
    const schluessel: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(KEY_PREFIX)) schluessel.push(k);
    }
    for (const k of schluessel) localStorage.removeItem(k);
  } catch {
    // ignorieren
  }

  // Erst die eigene Verbindung schließen, sonst blockiert sie das Löschen.
  try {
    const db = dbPromise ? await dbPromise.catch(() => null) : null;
    db?.close();
  } catch {
    // ignorieren
  }
  dbPromise = null;

  await new Promise<void>((fertig) => {
    let erledigt = false;
    const ende = () => {
      if (erledigt) return;
      erledigt = true;
      fertig();
    };
    /* Hält ein anderer Tab den Spiegel offen, kommt `onblocked` statt
       `onsuccess`. Dann warten wir kurz weiter — aber nicht ewig: lieber
       neu laden als hängen bleiben. */
    window.setTimeout(ende, 1500);
    try {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = ende;
      req.onerror = ende;
    } catch {
      ende();
    }
  });
}
