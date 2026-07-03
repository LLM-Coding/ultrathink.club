# ultrathink.club — „Coming Soon" Landing Page (Design)

**Datum:** 2026-06-04
**Status:** Approved
**Version:** v0.1.4

## Problem & Ziel

Der AI-Think-Tank hinter `ultrathink.club` will eine Community starten. Bis es so weit
ist, braucht es eine einzelne „Coming Soon"-Seite, die den Namen zeigt und Interessierte
auf eine Warteliste führt.

**Erfolgskriterium:** Besucher verstehen in <3 Sekunden „hier entsteht eine Community"
und können sich mit einem Klick auf die Warteliste setzen lassen.

## Scope

**In Scope**
- Eine statische `index.html` mit animiertem „ultrathink.club"-Wordmark
- Rotierende, humorvolle Slogans (Terminal-Stil)
- Call-to-Action auf ein externes Zugangs-Formular (Tally)
- Gründungsmitglieder als minimale Avatar-Reihe (LinkedIn-Links, selbst-gehostete Bilder)
- Founder-Talks (HMZE-Podcast) als „Im Gespräch"-Sektion, je Freitag ein Video mehr freigeschaltet
- Datensparsame Reichweitenmessung (GoatCounter)
- Deployment über GitHub Pages auf die Domain `ultrathink.club`

**Out of Scope (später)**
- Die eigentliche Community-Plattform
- Eigenes Formular-Backend (Zugangsanfrage läuft extern über Tally)
- Open-Graph-Bild (Follow-up)
- Mehrsprachigkeit / i18n

## Architektur

Eine einzige, selbst­enthaltene `index.html`:
- HTML-Struktur trägt **allen** Inhalt (Static-First).
- CSS inline im `<head>` (eine Datei, kein Build, kein Framework, kein SSG).
- Minimales inline JS nur für Progressive Enhancement (Slogan-Rotation).
- Die Seite ist **mit deaktiviertem JavaScript voll lesbar** — Wordmark, ein Default-Slogan,
  CTA und Footer stehen im HTML.

Begründung: Für eine Ein-Seiten-Seite ist eine Single-File-Lösung am einfachsten zu
deployen, am schnellsten zu laden und am leichtesten zu warten. Trennung in mehrere
Dateien brächte keinen Nutzen.

## Komponenten (Aufbau oben → unten)

1. **Wordmark**
   - ASCII-Art „ultrathink" im figlet-Font *DOS Rebel* (gefüllte Kleinbuchstaben im Retro-BBS-Look
     aus den Block-/Schattier-Zeichen `█` und `░`).
   - Animierter Regenbogen-Gradient, der kontinuierlich durch die Buchstaben wandert
     (`background-clip:text` + animierte `background-position`). **Kein** Font-Cycling (fest).
   - **Rendering als SVG-Maske (Korrektheit):** Die Art wird **nicht** als Monospace-Text
     gerendert, sondern als pixelgenaue **SVG-Maske** (`wordmark.svg`, ~6 KB, run-length-kodierte
     Rechtecke aus dem DOS-Rebel-Raster; `█` voll, `░` mit `fill-opacity:0.34`). Die Maske liegt
     über einem `<div>` mit der animierten Regenbogen-CSS-Fläche (`mask`/`-webkit-mask`,
     `center/contain`). Grund: Text-basierte ASCII-Art driftet auf manchen Browsern/OS sub-pixel
     (Glyph-Pixel-Snapping, durch Windows-Display-Skalierung 125/150 % verschärft) — ein zuvor
     getesteter self-gehosteter, gesubsetteter Webfont machte zwar alle Glyphen gleich breit
     (`space = █ = ░ = 600 Einheiten`), behob den Rasterungs-Drift aber nicht. Die SVG-Maske ist
     vektor- und auflösungsunabhängig und damit auf jedem Browser/OS/Display identisch.
   - „.club" als Suffix in Monospace (Courier New), rechtsbündig unter die Art gehängt,
     der Punkt grün als Akzent.
   - Schriftgröße per `clamp()` so gekappt, dass die 96 Zeichen breite Art auf keinem Viewport
     horizontal überläuft (verifiziert bei 1280px und 390px).
   - **Barrierefrei/SEO:** visuell verstecktes `<h1>ultrathink.club</h1>`; die ASCII-Art
     trägt `role="img"` und `aria-label="ultrathink"`, damit Screenreader und Crawler/LLMs
     den echten Namen lesen.

2. **Slogan-Zeile**
   - Terminal-Prompt-Optik: `~$ <slogan>` mit blinkendem Cursor.
   - **Ein** Slogan steht statisch im HTML (Fallback ohne JS).
   - JS zeigt **einen zufälligen** Slogan pro Seitenaufruf (Fight-Club-Anspielung, AI-/Terminal-Witze;
     DE+EN gemischt) — **keine** Rotation (subtiler).

3. **Call-to-Action**
   - Button „→ Zugang anfragen" öffnet das externe **Tally**-Formular (`WOqr7j`) als Modal
     (`embed.js`, `data-tally-open`); ohne JS navigiert der `href` zum Formular. Invite-only-Positionierung.

4. **Gründungsmitglieder**
   - Minimale Avatar-Reihe („·· founded by ··") zwischen CTA und Footer: vier runde Avatare
     (Stephan Schmidt, Ralf D. Müller, Ingo Eichhorst, Uwe Franke), je verlinkt auf das
     LinkedIn-Profil (`target=_blank rel=noopener`), der **Name erscheint bei Hover/Focus unter**
     dem Bild in einem reservierten Slot (kein Layout-Shift, überlagert keine andere Schrift).
   - **Reihenfolge bei jedem Laden zufällig** (Fisher–Yates, JS-Progressive-Enhancement);
     ohne JS bleibt die statische HTML-Reihenfolge.
   - **Avatare selbst-gehostet** unter `avatars/*.jpg` (100×100, ~5 KB), **nicht** von LinkedIn
     gehotlinkt: die Quell-URLs sind signiert und laufen ab, Self-Hosting vermeidet zudem einen
     Drittanbieter-Request pro Besuch (DSGVO / Static-First).
   - **Follow-Link zur LinkedIn-Organisation** (`/company/ultrathink-club/`) als dezente Zeile
     („↳ Folge uns auf LinkedIn ↗") direkt unter der Avatar-Reihe; verbindet Gründer und Organisation.

5. **Im Gespräch (Founder-Talks, HMZE-Podcast)**
   - Sektion „·· im gespräch · HMZE Podcast ··" unter der Founder-Reihe: vier Talk-Karten
     (Stephan, Ralf, Ingo, Uwe), je ein YouTube-Video aus dem HMZE-Podcast.
   - **Zeitgesteuerte Freischaltung:** je Freitag 08:00 Europe/Berlin (= 06:00 UTC, CEST) ein
     Video mehr, in fester Reihenfolge (Stephan 03.07. → Ralf 10.07. → Ingo 17.07. → Uwe 24.07.).
     Umsetzung als feste UTC-Zeitstempel je Karte (`data-unlock`); ein **synchrones** Inline-Skript
     (direkt nach der Sektion, gegen FOUC) blendet noch nicht fällige Karten aus, verbirgt die ganze
     Sektion solange keine fällig ist. Zeitzonensicher via `Date.now()`-Vergleich.
   - **Static-First:** Alle vier Karten stehen **im HTML** und verlinken auf YouTube — ohne JS ist
     die Sektion voll sichtbar (Fallback), JS steuert nur Sichtbarkeit und Inline-Play.
   - **DSGVO-Klick-Facade:** Karte zeigt ein **selbst-gehostetes** Thumbnail (`talks/*.jpg`,
     YouTube maxres, 16:9); erst beim Klick wird ein `youtube-nocookie.com`-iframe eingesetzt —
     kein Drittanbieter-Request/Cookie beim Seitenaufruf.
   - **Deep-Link-Anker** je Person (`#stephan`, `#ralf`, `#ingo`, `#uwe`), damit die
     wöchentlichen LinkedIn-Posts direkt auf das jeweilige Video zeigen können.

6. **Footer**
   - Versionsnummer (`v0.1.0`).
   - Disclaimer „Not affiliated with Anthropic" (mindert Verwechslungs-/Affiliation-Risiko,
     siehe Markenrecherche unten).
   - © 2026 ultrathink.club.
   - **Positionierung:** `margin-top:auto` statt `position:fixed` — bleibt auf kurzer Seite
     (Talks verborgen) unten, fließt auf langer Seite hinter den Inhalt, ohne ihn zu überlagern.

## Querschnitt

- **Analytics:** GoatCounter (`https://ultrathink.goatcounter.com/count`, Code `ultrathink`).
  Cookielos, datensparsam, DSGVO-freundlich. Lädt `async` und beeinflusst den Inhalt nicht.
- **Barrierefreiheit:** `@media (prefers-reduced-motion: reduce)` schaltet Regenbogen-Flow,
  Cursor-Blinken und Slogan-Rotation ab (statischer Zustand).
- **SEO/Social:** `<title>`, `meta description`, Open-Graph- und Twitter-Card-Tags.
- **Responsiv:** Wordmark skaliert per `clamp()`/`vw`; auf schmalen Screens horizontal
  scrollbar statt umgebrochen (ASCII-Art darf nicht umbrechen).

## Deployment

- GitHub Pages aus Branch `main`, Root-Verzeichnis.
- `CNAME` mit Inhalt `ultrathink.club` für die Custom Domain; „Enforce HTTPS" aktiv.
- Keine Build-Pipeline nötig (reines statisches HTML).

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Die komplette Seite (HTML + inline CSS + minimal JS) |
| `wordmark.svg` | Pixelgenaue SVG-Maske des „ultrathink"-Schriftzugs (DOS Rebel, ~6 KB) |
| `avatars/*.jpg` | Selbst-gehostete Founder-Avatare (Stephan, Ralf, Ingo, Uwe; 100×100) |
| `talks/*.jpg` | Selbst-gehostete YouTube-Thumbnails der HMZE-Talks (maxres, 16:9) |
| `CNAME` | Custom-Domain für GitHub Pages |
| `favicon.svg` | Inline-SVG-Favicon (kleiner Regenbogen-Block) |
| `.gitignore` | ignoriert `.superpowers/`, `.playwright-cli/` |
| `LICENSE` | bestehend (MIT) |

## Versionierung

Version im Footer **und** als HTML-Kommentar sichtbar, Start bei `v0.1.0`.

## Offene Punkte / Abhängigkeiten

- **Tally-Formular:** Verdrahtet (`WOqr7j`, Modal via `embed.js`). Erledigt.
- **LinkedIn-Vanity-URLs:** Aktuell die member-URN-Links (`/in/ACoAA…`); falls die Founder
  saubere Vanity-URLs haben, diese eintragen.
- **GoatCounter-Konto:** Muss mit Code `ultrathink` existieren, sonst zählt das Snippet ins Leere.
- **Markenrecherche (vor echtem Launch, nicht für diese Seite):**
  „ultrathink" wird von mehreren Dritten genutzt (u.a. ultrathink.de — Hamburg, KI, B2B-SaaS;
  tryultrathink.com; ultrathinksolutions.com; Anthropic/Claude-Code-Keyword). Keine
  eingetragene Wortmarke per Websuche gefunden, aber **DPMA/EUIPO-Registerprüfung** (Klassen
  35/41/42) und ggf. anwaltliche Beratung vor kommerziellem Launch empfohlen. Positionierung
  klar als *Community/Club* (nicht Produkt) und Anthropic-Disclaimer mindern das Risiko.
