# `app_schnittstelle.py` gibt es nicht mehr

Sie hat dasselbe getan wie `scripts/pokermath-app-daten.mjs` im
Projektstamm: aus den Rechenergebnissen die schlanke Anzeigefassung nach
`public/pokermath/` schreiben. Zwei Programme mit derselben Aufgabe in zwei
Sprachen sind keine Redundanz, sondern eine Zeitbombe: Wer ein Feld ergänzt,
ergänzt es in einem von beiden, und ab dann hängt es davon ab, wer zuletzt
gelaufen ist.

**Geblieben ist das Node-Skript**, weil es das ist, was die App beim Bauen
ohnehin aufruft:

```bash
npm run daten
```

Es tut drei Dinge, die die Python-Fassung nicht tat: Es holt jedes Feld über
eine Prüfung mit Pfadangabe, es schreibt erst, wenn **alle** Blöcke
vollständig gebaut sind, und es trägt den Datenstand in den Service Worker
ein, damit ein installiertes Gerät nach neuen Zahlen nicht die alten zeigt.

Auch `output/app/` ist weg — es war die zweite Kopie derselben Dateien.
Es gibt jetzt genau zwei Orte: `output/*.json` (der Nachweis) und
`public/pokermath/*.json` (die Anzeigefassung).

Siehe `BLOCKER.md`, B-004, und `ENTSCHEIDUNGEN.md`, E-020.
