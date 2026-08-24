# Eigene Domain für PokerMentor (ca. 15 Minuten + DNS-Wartezeit)

Statt `4cys62s2wp-beep.github.io/poker/` läuft die App dann z. B. unter
**pokermentor.app** oder **pokermentor.de** – professioneller Auftritt, leichter
zu merken, besser zum Teilen. GitHub Pages unterstützt eigene Domains kostenlos
inklusive HTTPS-Zertifikat.

## 1. Domain kaufen (nur du kannst das)

Bei einem beliebigen Registrar, z. B. Namecheap, Cloudflare, IONOS oder Strato.
Kosten: meist 3–15 €/Jahr. Tipps zur Wahl:

- `.app` erzwingt HTTPS (gut!), `.de` wirkt lokal vertrauenswürdig, `.com` international.
- Kurz und tippbar – der Name landet auf QR-Codes und in Insta-Bios.

## 2. DNS beim Registrar einstellen

Für eine **Subdomain-freie Domain** (z. B. `pokermentor.app`) vier A-Records anlegen:

```
A  @  185.199.108.153
A  @  185.199.109.153
A  @  185.199.110.153
A  @  185.199.111.153
```

Optional zusätzlich `www` als CNAME auf `4cys62s2wp-beep.github.io` zeigen lassen.

## 3. Domain in GitHub eintragen

1. GitHub → Repository → **Settings → Pages**.
2. Bei **Custom domain** die Domain eintragen (z. B. `pokermentor.app`) → Save.
   GitHub legt dadurch automatisch eine `CNAME`-Datei im Deployment an.
3. Sobald der DNS-Check grün ist: Haken bei **Enforce HTTPS** setzen
   (das Zertifikat stellt GitHub automatisch aus, kann bis zu 24 h dauern).

## 4. Danach in der App anpassen (kann Claude übernehmen)

- In `index.html` die `og:url`- und `og:image`-Meta-Tags auf die neue Domain ändern.
- Falls Cloud-Konten aktiv sind: in der Firebase-Konsole unter
  **Authentication → Settings → Autorisierte Domains** die neue Domain hinzufügen.
- Der QR-Code in der App zeigt automatisch auf die neue Domain (er nutzt die
  aktuelle Adresse) – da ist nichts zu tun.

## Hinweis zur alten Adresse

Die `github.io`-Adresse leitet nach dem Umzug automatisch auf die neue Domain
weiter – bereits geteilte Links und installierte PWAs funktionieren weiter.
