# Screen-Struktur: vorher und nachher

Anforderung 2.4 verlangt, die aktuelle Struktur zu dokumentieren, die
Ziel-Struktur danebenzustellen und **beides auszugeben, bevor umgebaut wird**.

---

## 1. Bestand (vor dem Umbau)

35 Routen, verteilt auf eine flache Navigation.

```
/                          Dashboard
│
├─ NAVIGATION (Seitenleiste, 4 Gruppen · 12 Links)
│  ├─ Übersicht
│  │  └─ /                 Start
│  ├─ Lernen
│  │  ├─ /lernen           Lernpfad
│  │  ├─ /pros             Pro-Insights
│  │  ├─ /wiederholen      Wiederholen
│  │  ├─ /trainer          Trainer
│  │  └─ /glossar          Glossar
│  ├─ Anwenden
│  │  ├─ /coach            Live-Coach
│  │  ├─ /spielen          Übungstisch
│  │  ├─ /tisch            Pokerabend
│  │  └─ /tools            Tools
│  └─ Du
│     ├─ /profil           Profil
│     ├─ /freunde          Freunde
│     └─ /pro              Pro         (nur mit Monetarisierung)
│
├─ UNTERE LEISTE (mobil, 5 Punkte)
│  /  ·  /lernen  ·  /coach  ·  /trainer  ·  /tools
│
└─ DETAILSEITEN (nicht in der Navigation)
   ├─ /lernen/:modul                    Modulübersicht
   ├─ /lernen/:modul/:lektion           Lektion
   ├─ /tagesquiz                        Tages-Quiz
   ├─ /trainer/{szenario,pushfold,preflop,potodds,equity,handranking,outs}
   ├─ /tools/{equity,ranges,odds,bankroll,tells,hands,chips}
   ├─ /tisch/online                     Online-Tisch
   ├─ /rechtliches                      Rechtsseite
   └─ /kuendigen                        Kündigung
```

### Was daran nicht stimmt

| Befund | Wirkung |
|---|---|
| **12 Links in der Seitenleiste, 5 in der unteren Leiste** | Wer zum ersten Mal öffnet, muss lesen und wählen, bevor er irgendetwas tun kann |
| **Die Gruppen sind nach Art benannt, nicht nach Absicht** | „Anwenden" enthält Live-Coach (echter Pokerabend), Übungstisch (Simulation), Pokerabend (Chipverwaltung) und Tools (Rechner) — vier grundverschiedene Absichten in einer Gruppe |
| **Die untere Leiste bildet die Seitenleiste nicht ab** | Mobil fehlen Pokerabend, Freunde, Profil ganz; „Mehr" führt auf `/tools`, was etwas anderes ist |
| **Der Startbildschirm ist eine Kachelwand** | Held-Bereich, 3 Kennzahl-Karten, 4 Schnellzugriffe, nächste Lektion, Tages-Quiz, Tipp — kein Fokus |
| **Kein Weg zurück nach oben** | Von `/trainer/szenario` führt kein sichtbarer Weg zu `/trainer` |

---

## 2. Ziel-Struktur

Drei Absichten, drei Bereiche, gleiche Tiefe: **Hub → Bereich → Detail.**

```
/                          HUB
│  ├─ Kopf: Streak · Level · XP        (schmal, nicht dominant)
│  ├─ Quick Access                     „Weiter: Lektion 12" / „Letzte Session"
│  ├─ Karte 1  LERNEN        → /lernen
│  ├─ Karte 2  LIVE SPIELEN  → /live
│  ├─ Karte 3  SESSION-TOOLS → /tools
│  └─ Karte 4  MIT FREUNDEN  (Platz im Raster vorgesehen, noch nicht gebaut)
│
├─ /lernen                  BEREICH LERNEN
│  ├─ /lernen/:modul                   Modulübersicht
│  ├─ /lernen/:modul/:lektion          Lektion
│  ├─ /lernen/wiederholen              Wiederholen        (war /wiederholen)
│  ├─ /lernen/tagesquiz                Tages-Quiz         (war /tagesquiz)
│  ├─ /lernen/pros                     Pro-Insights       (war /pros)
│  ├─ /lernen/trainer                  Trainer-Übersicht  (war /trainer)
│  │  └─ /lernen/trainer/:id           einzelner Trainer
│  └─ /lernen/glossar                  Glossar            (war /glossar)
│
├─ /live                    BEREICH LIVE SPIELEN
│  ├─ /live/coach                      Live-Coach         (war /coach)
│  ├─ /live/tisch                      Pokerabend         (war /tisch)
│  ├─ /live/tisch/online               Online-Tisch
│  ├─ /live/uebungstisch               Übungstisch        (war /spielen)
│  └─ /live/statistik                  Spielstil-Analyse  (NEU)
│
├─ /tools                   BEREICH SESSION-TOOLS
│  ├─ /tools/chips                     Chip-Rechner
│  ├─ /tools/bankroll                  Bankroll
│  ├─ /tools/equity                    Equity-Rechner
│  ├─ /tools/odds                      Odds-Tabellen
│  ├─ /tools/ranges                    Range-Charts
│  ├─ /tools/hands                     Starthand-Explorer
│  └─ /tools/tells                     Tells & Reads
│
└─ /du                      PERSÖNLICHES (nicht im Hub, in der Leiste)
   ├─ /profil                          Profil & Einstellungen
   ├─ /freunde                         Freunde
   ├─ /pro                             Pro                (nur mit Monetarisierung)
   ├─ /rechtliches                     Rechtsseite
   └─ /kuendigen                       Kündigung
```

### Untere Leiste: 5 → 4, mit Beschriftung

```
Start  ·  Lernen  ·  Live  ·  Du
```

Die vier Punkte entsprechen genau den drei Hub-Karten plus Persönliches.
Session-Tools sind über die Hub-Karte erreichbar, nicht über die Leiste —
sie werden während einer Sitzung gebraucht, nicht ständig.

### Warum die Umbenennung der Pfade

Alte Pfade (`/coach`, `/wiederholen`, `/pros` …) bleiben als
**Weiterleitungen** bestehen. Zwei Gründe: Geteilte Links und Lesezeichen
dürfen nicht brechen, und die PWA hat Verknüpfungen im Manifest, die auf alte
Pfade zeigen.

---

## 3. Erreichbarkeit und Rückweg

Regel: **Jede Seite ist in höchstens drei Schritten vom Hub aus erreichbar,
und jede hat genau einen eindeutigen Rückweg.**

| Ebene | Rückweg |
|---|---|
| Hub | — |
| Bereich (`/lernen`, `/live`, `/tools`) | untere Leiste → Start |
| Detail (`/lernen/m3`, `/live/coach` …) | Zurück-Pfeil im Seitenkopf → Bereich |
| Unter-Detail (`/lernen/m3/m3-l2`) | Zurück-Pfeil → Modul |

Der Zurück-Pfeil ist **kein** Browser-Zurück: Er führt immer eine Ebene nach
oben in der Struktur, unabhängig davon, woher man kam. Browser-Zurück bleibt
zusätzlich funktionsfähig.

Vollständige Erreichbarkeitstabelle: `docs/ERREICHBARKEIT.md` (Phase 3.3).

---

## 4. Was der Umbau NICHT anfasst

- **Keine Seite wird gelöscht.** Alle 35 Routen bleiben erreichbar.
- **Keine Funktion wird entfernt.** Der Umbau betrifft Navigation und
  Startbildschirm, nicht den Inhalt der Seiten.
- **Die Kartenlounge-Identität bleibt.** Filzgrün, Gold, Fraunces, das eigene
  Icon-Set (siehe `DESIGN_REFERENZ.md`, R8).
