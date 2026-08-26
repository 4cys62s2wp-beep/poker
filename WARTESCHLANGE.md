# Warteschlange

Einheiten, die nicht durchführbar waren, mit dem genauen Hinderungsgrund.
Nicht „später" — sondern: was fehlt, damit es geht.

Eine Einheit wird höchstens zweimal erneut versucht. Danach bleibt sie liegen
und erscheint im Abschlussbericht als Entscheidungsbedarf.

---

## W-001 · Restzeitschätzung von B4 auf Konfigurationen umstellen

**Was.** `lauf()` in `tools/poker-math/src/b4_preflop_equity.py` rechnet die
Restzeit aus fertigen Handpaaren hoch. Sauberer wäre: gemessene Sekunden je
Farbkonfiguration gegen die Zahl der verbleibenden Konfigurationen.

**Warum es heute Nacht nicht geht.** Zwei Gründe, beide hart:

1. `tools/poker-math/` gehört dem laufenden B4-Prozess (Auftrag A1). Dort
   wird gelesen, nicht geschrieben.
2. Der Prozess hat sein Modul längst geladen. Eine Änderung an der Datei
   wirkt erst nach einem Neustart — und der Auftrag sagt ausdrücklich:
   berichten, ohne den Lauf anzuhalten.

**Was stattdessen geschah.** Die ehrliche Zahl ist gemessen und in
`NACHTLAUF.log` samt Grundlage protokolliert. Ergebnis: Beide Grundlagen
kommen hier aufs Gleiche (E-024).

**Wann es geht.** Sobald B4 durch ist. Dann ist es eine Zehn-Minuten-Änderung.

**Versuche:** 1.

---

## W-002 · Die dokumentierte Zahl 47 008 korrigieren

**Was.** Der Kopfkommentar von `b4_preflop_equity.py` nennt 47 008
verschiedene Rechnungen. Es sind 47 086. Die 78 fehlenden sind die Handpaare
aus derselben Rangkombination, einmal offsuit und einmal suited.

**Warum es heute Nacht nicht geht.** Dieselbe Sperre wie W-001: Der Ordner
gehört dem laufenden Prozess.

**Was dazugehört, wenn es gemacht wird.** Nicht nur die Zahl ändern, sondern
einen Test ergänzen, der sie nachzählt. Eine Zahl im Kommentar, die niemand
prüft, ist genau der Fehler, gegen den dieses Projekt gebaut ist — sie ist
über Monate unbemerkt falsch geblieben.

**Wann es geht.** Sobald B4 durch ist.

**Versuche:** 1.

---

## W-003 · Gehört der Online-Tisch noch in die App?

**Was.** Unter `/session/tisch/online` liegt ein Tisch, an dem mehrere Geräte
über einen Code zusammenspielen. Gespielt wird mit Punkten, nicht mit Geld.

**Warum das eine offene Frage ist.** Der Auftrag setzt für den Inhalt eine
enge Grenze (B1): erlaubt sind reine Zahlenverwaltung — Listen, Stände,
Uhren, Rechner — und Lehrmaterial als Standbild, also eine Situation, eine
Entscheidung, eine Auflösung, dann Schluss. Ein Tisch, an dem mehrere Leute
über Geräte hinweg Hände gegeneinander spielen, ist beides nicht. Er ist auch
kein Glücksspiel — es geht um nichts —, aber er ist gespieltes Poker und
nicht verwaltetes.

**Warum es heute Nacht nicht entschieden wurde.** Der Auftrag sagt für genau
diesen Fall: unklar → Warteschlange. Die Entscheidung hat Folgen, die über
Gestaltung hinausgehen (Altersfreigabe der App in den Stores), und sie ist
nicht umkehrbar, wenn der Bildschirm erst entfernt ist.

**Was vorbereitet ist.** Der Bildschirm liegt seit Phase 2 nicht mehr hinter
dem Ein-Geräte-Tisch, sondern daneben — er ist damit ein einzelner Eintrag,
den man entfernen kann, ohne dass ein Weg zerbricht. Der Wegetest würde die
Änderung sofort bestätigen.

**Was der Auftraggeber entscheiden muss.** Bleibt der Online-Tisch, bleibt
auch der Ein-Geräte-Tisch (`/session/tisch`) — beide sind gespieltes Poker.
Fällt die Grenze aus B1 streng aus, fallen beide.

**Versuche:** 0 — hier fehlt keine Technik, hier fehlt eine Entscheidung.
