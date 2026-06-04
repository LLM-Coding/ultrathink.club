# ultrathink.club — „Coming Soon" Landing Page (Design)

**Datum:** 2026-06-04
**Status:** Approved
**Version:** v0.1.0

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
- Call-to-Action auf eine externe Warteliste (rapidmail)
- Datensparsame Reichweitenmessung (GoatCounter)
- Deployment über GitHub Pages auf die Domain `ultrathink.club`

**Out of Scope (später)**
- Die eigentliche Community-Plattform
- Eigenes Formular-Backend (Warteliste läuft extern über rapidmail)
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
   - Button „→ Join the waitlist" verlinkt auf das externe rapidmail-Anmeldeformular.
   - Bis die finale rapidmail-URL vorliegt: Platzhalter-`href` (`#`), klar markiert.

4. **Footer**
   - Versionsnummer (`v0.1.0`).
   - Disclaimer „Not affiliated with Anthropic" (mindert Verwechslungs-/Affiliation-Risiko,
     siehe Markenrecherche unten).
   - © 2026 ultrathink.club.

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
| `CNAME` | Custom-Domain für GitHub Pages |
| `favicon.svg` | Inline-SVG-Favicon (kleiner Regenbogen-Block) |
| `.gitignore` | ignoriert `.superpowers/`, `.playwright-cli/` |
| `LICENSE` | bestehend (MIT) |

## Versionierung

Version im Footer **und** als HTML-Kommentar sichtbar, Start bei `v0.1.0`.

## Offene Punkte / Abhängigkeiten

- **rapidmail-URL:** Das Anmeldeformular muss im rapidmail-Konto angelegt und die URL
  nachgereicht werden; bis dahin Platzhalter-Link.
- **GoatCounter-Konto:** Muss mit Code `ultrathink` existieren, sonst zählt das Snippet ins Leere.
- **Markenrecherche (vor echtem Launch, nicht für diese Seite):**
  „ultrathink" wird von mehreren Dritten genutzt (u.a. ultrathink.de — Hamburg, KI, B2B-SaaS;
  tryultrathink.com; ultrathinksolutions.com; Anthropic/Claude-Code-Keyword). Keine
  eingetragene Wortmarke per Websuche gefunden, aber **DPMA/EUIPO-Registerprüfung** (Klassen
  35/41/42) und ggf. anwaltliche Beratung vor kommerziellem Launch empfohlen. Positionierung
  klar als *Community/Club* (nicht Produkt) und Anthropic-Disclaimer mindern das Risiko.
