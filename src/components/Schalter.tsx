/* Ein Schalter für „an / aus".
   ============================

   Statt der Checkbox des Browsers: Sie ist 18 Pixel groß und sieht auf jedem
   Gerät anders aus. Der Schalter ist ein Knopf mit `role="switch"` — Tastatur
   und Bildschirmleser sagen „Schalter, an". Daneben steht das Wort „An" oder
   „Aus", damit der Zustand nicht nur an einer Farbe hängt. */

interface Props {
  an: boolean;
  onChange: (an: boolean) => void;
  label: string;
  beschreibung?: string;
  zustand: { an: string; aus: string };
}

export function Schalter({ an, onChange, label, beschreibung, zustand }: Props) {
  return (
    <div className="schalter-zeile">
      <div className="schalter-text">
        <div className="schalter-label">{label}</div>
        {beschreibung && <div className="small muted">{beschreibung}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={an}
        aria-label={label}
        className={`schalter${an ? ' an' : ''}`}
        onClick={() => onChange(!an)}
      >
        <span className="schalter-spur" aria-hidden="true"><span className="schalter-knopf" /></span>
        <span className="schalter-zustand">{an ? zustand.an : zustand.aus}</span>
      </button>
    </div>
  );
}
