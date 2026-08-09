# Produktion einer Folge — Vorgehen und Checklisten

Wie eine Folge von `ultrathink.breakfast.club` entsteht, von der Grafik bis zum
Podcast-Verzeichnis. Geschrieben nach Folge 1 („Token Efficiency", 07.08.2026); alle
Zahlen sind gemessen, nicht geschätzt. Die Fallstricke stehen dabei, weil sie in Folge 1
zusammen mehrere Stunden gekostet haben.

**Reihenfolge:** Schritte 1 bis 3 laufen vor der Aufnahme, 4 bis 8 danach, 9 bis 11 sind
die Veröffentlichung. Schritt 6 blockiert alles Weitere — früh starten.

---

## 1. Cover und Vorspann erstellen

**In der Session `PersonalAssistant` ein Cover-Picture und ein Intro-Video erstellen.**

Für Folge 1 entstanden dort die Titelgrafik („Token Efficiency", die vier Gesichter als
Jetons auf dem Spieltisch) und der Vorspann: Terminal-Karten mit getippten Zeilen, von
mehreren KI-Stimmen gesprochen.

Der Vorspann trägt die Dramaturgie des Formats und sollte sie behalten: Die KI gibt die
Lehrbuchantwort zum Thema und sagt dann selbst, dass das nur die Oberfläche ist — *„Eine
Ebene tiefer fängt jetzt bei euch an."* Dazu die beiden Regeln als Fight-Club-Anspielung.

Die Titelgrafik wird später dreifach verwendet: als Thumbnail auf der Website, als
Custom-Thumbnail bei YouTube und als Bild im Podcast-Feed. Sie muss also auch klein
lesbar sein.

**Nicht verwechseln:** Das *Podcast-Cover* ist nicht die Folgengrafik, sondern das Logo —
quadratisch, 3000 × 3000, im Repo unter `podcast-cover.html` (wird per Playwright zu
`podcast-cover.png` gerendert). Es gilt für alle Folgen und ändert sich nicht.

---

## 2. Aufnahme in Zoom

Eine Einstellung entscheidet über den halben Rest der Produktion.

### Vor der Aufnahme

- [ ] **„Separate Audiodatei für jeden Teilnehmer aufzeichnen"** ist an
      (Zoom → Einstellungen → Aufzeichnung, gilt für lokale Aufnahmen)
- [ ] Automatische Mikrofonaussteuerung ist **bei allen aus**, Pegel so, dass Spitzen bei
      etwa −6 dBFS liegen
- [ ] Alle tragen Kopfhörer — sonst übersprechen die Einzelspuren
- [ ] Netzteil angesteckt, Speicherplatz geprüft
- [ ] Meeting heißt `ultrathink.breakfast.club Folge N`
- [ ] Einmalig prüfen, ob das Konto 1080p hergibt (Group HD)

**Warum die erste Einstellung so wichtig ist:** Sie legt neben der Aufnahme einen Ordner
`Audio Record` mit einer M4A pro Person an, benannt nach den Teilnehmern. Damit wird die
Sprecherzuordnung im Transkript zur Messung statt zur Schätzung, und die Lautstärke jedes
Einzelnen lässt sich prüfen. Nachträglich ist das nicht nachholbar.

**Was in Folge 1 schiefging:** Uwe und Stephan lagen mit ihren Spitzen bei 0,0 und
+0,1 dBFS, also auf Vollaussteuerung — daher ist die Mischung mit +0,43 dBTP übersteuert.
Nicht reparierbar, bei dem Maß nicht hörbar, aber vermeidbar. Die Lautheit untereinander
war dagegen unauffällig (1,3 LUFS Spanne).

### Nach der Aufnahme

- [ ] **Zoom-Ordner behalten**, bis die Folge veröffentlicht ist
- [ ] Aufnahmedatum notieren — der Ordnername trägt nur Datum und Meetingtitel

---

## 3. Schnitt in Camtasia

- [ ] Vorspann davor, Abspann dahinter
- [ ] Camtasia-Projekt sichern, nicht nur den Export
- [ ] Schnitte im Gesprächsteil vermeiden, wenn möglich

**Warum das letzte zählt:** Jeder Schnitt verschiebt die Video-Zeitachse gegen die
Zoom-Zeitachse. Solange die Sprecherzuordnung über Stimmabdrücke läuft, ist das egal. Will
man aber eines Tages die Einzelspuren direkt transkribieren, braucht man eine
durchgehende Zeitachse.

---

## 4. Ton normalisieren

Zoom liefert rund **−20 LUFS**. YouTube normalisiert auf etwa −14, Podcast-Verzeichnisse
auf −16 — und **beide drehen nur herunter, nie herauf**. Ohne Nachbearbeitung läuft die
Folge dauerhaft leiser als alles andere im Feed.

Nicht in Camtasia nachbessern: Das hieße 37 Minuten neu rendern, obwohl am Bild nichts zu
ändern ist, und Camtasia kennt keine LUFS-Messung. Stattdessen auf der fertigen MP4
arbeiten, Videospur kopieren:

```bash
# Durchgang 1 — messen
ffmpeg -i "$SRC" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -

# Durchgang 2 — normalisieren, begrenzen, kodieren (Messwerte aus Durchgang 1 einsetzen)
ffmpeg -y -i "$SRC" \
  -af "loudnorm=I=-14.5:TP=-1.5:LRA=11:measured_I=…:measured_TP=…:measured_LRA=…:measured_thresh=…:offset=…,\
aresample=44100,alimiter=limit=0.708:attack=5:release=50:level=0" \
  -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 96k folge-N.mp3

# Kontrolle — immer messen, nie glauben
ffmpeg -i folge-N.mp3 -af ebur128=peak=true -f null -
```

**Drei Fallstricke, jeder davon hat in Folge 1 einen Durchgang gekostet:**

1. `loudnorm` allein reicht nicht, wenn die Quelle schon übersteuert ist. Es fällt dann auf
   dynamische Normalisierung zurück und seine Pegelgrenze hält nicht — Ergebnis war
   +1,3 dBFS statt −1,5.
2. `alimiter` hebt den Pegel per Voreinstellung wieder auf 0 dB an und macht damit genau
   das rückgängig, wofür man ihn einsetzt. **`level=0` nicht vergessen.**
3. Der Limiter kostet rund 1 LU Lautheit. Der Zielwert der Normalisierung muss also höher
   liegen als der Zielwert des Ergebnisses (`I=-14.5` für ein Ergebnis um −16).

**Zielwerte:** Podcast −16 LUFS (±1), YouTube −14 LUFS, Spitzen jeweils unter −1,5 dBTP.

### Die Tonspur des Videos ist damit noch nicht erledigt

Der Schritt oben erzeugt die MP3 für den Podcast. **Das MP4 hat davon nichts** — es liegt
weiter bei den rund −20 LUFS aus Zoom. Das ist in Folge 1 beinahe untergegangen.

Die Videospur wird dabei nur kopiert, es wird also nichts neu gerendert:

```bash
ffmpeg -y -i "$SRC" -c:v copy \
  -af "loudnorm=I=-12.5:TP=-1.5:LRA=11:measured_I=…:measured_TP=…:measured_LRA=…:measured_thresh=…:offset=…,\
aresample=48000,alimiter=limit=0.708:attack=5:release=50:level=0" \
  -c:a aac -b:a 192k -ar 48000 folge-N-ton.mp4
```

Der Zielwert steht auf −12,5, nicht −14: Der Limiter frisst rund anderthalb LU, und das
Ergebnis soll bei −14 landen. Immer nachmessen.

> **Vor dem ersten Hochladen erledigen.** YouTube lässt die Videodatei nicht ersetzen. Wer
> nachbessern will, muss neu hochladen, und das Video bekommt eine **neue ID**. Solange
> nichts veröffentlicht ist, kostet das nur ein Suchen-und-Ersetzen — in Folge 1 steckte
> die ID an 74 Stellen der Unterseite, davon 46 Transkript-Zeitmarken. Nach der
> Veröffentlichung bricht es jeden geteilten Link.

- [ ] Tonspur korrigiert, bevor das Video das erste Mal hochgeladen wird
- [ ] Nach einem Neu-Upload die Video-ID in Unterseite, Beschreibung und Social-Texten
      nachziehen

---

## 5. Audio für die Transkription vorbereiten

```bash
ffmpeg -i "$SRC" -vn -ac 1 -ar 16000 -c:a pcm_s16le folge.wav
```

16 kHz Mono ist das, was Whisper intern nutzt — mehr bringt nichts, kostet aber Speicher.
Für die MP3 dagegen **nie** diese Datei nehmen, die klingt dumpf.

---

## 6. Transkribieren

```bash
uv tool install whisper-ctranslate2
whisper-ctranslate2 --model medium --language de --compute_type int8 \
  --threads 8 --vad_filter True --output_format all --output_dir transcript folge.wav
```

**Rechne mit dem Zwei- bis Dreifachen der Spielzeit.** Folge 1: 37 Minuten Audio, rund
90 Minuten auf zwölf Kernen ohne GPU. Früh starten, es blockiert alles Weitere.

**Der teuerste Fehler in Folge 1: zweimal der OOM-Killer.** `medium` belegt 2,5 GB. Auf
einer Maschine mit 7,8 GB reicht das nicht, wenn nebenher ffmpeg kodiert oder ein zweiter
Python-Prozess Embeddings rechnet. Beide Male war der Prozess nach einer knappen Stunde
weg (Exit 137).

- [ ] Während der Transkription **nichts Speicherhungriges** starten
- [ ] Vorher Browser und überzählige Terminals schließen — das brachte hier 2 GB
- [ ] Vor dem Start `free -m` prüfen: unter 3 GB frei nicht anfangen

**Wenn es doch abstürzt, ist die Arbeit nicht verloren.** Whisper schreibt die
Ausgabedateien zwar erst am Ende, protokolliert die Segmente aber laufend mit
Zeitmarken. Aus dem Log lässt sich der fertige Teil parsen, der Rest ab der letzten
Zeitmarke neu transkribieren und beides zusammensetzen. Folge 1 besteht aus drei solchen
Teilen.

**Fortschritt ist nicht sichtbar,** weil Python die Ausgabe blockweise puffert, wenn sie
in eine Datei geht. Verlässlicher Indikator ist die CPU-Zeit des Prozesses: wächst sie
schneller als die Uhr, rechnet er.

---

## 7. Sprecher zuordnen

Nicht raten, messen. Aus jeder Zoom-Einzelspur wird ein Stimmabdruck mit Namen, und
dagegen wird die geschnittene Tonspur gemessen (`identify2.py`, ECAPA-TDNN aus
SpeechBrain).

Der Weg im Einzelnen:

1. Aus jeder Einzelspur die Fenster wählen, in denen **diese** Person die anderen um das
   Vierfache übertönt — sonst wandert Übersprechen in den Stimmabdruck.
2. Die geschnittene Tonspur in Fenster von 1,5 Sekunden zerlegen und jedes einbetten.
3. **Beide Seiten zentrieren** (jeweils den eigenen Mittelwert abziehen).
4. Jedes Fenster gegen alle Referenzfenster messen, pro Person die fünf besten Treffer
   mitteln, Mehrheitsentscheid je Segment.

**Der entscheidende Schritt ist Nummer 3.** Ohne Zentrierung dominiert eine gemeinsame
Richtung — Raum, Mikrofon, Codec — alle Vektoren, und alles ist zu allem ähnlich. Der
erste Versuch in Folge 1 steckte deshalb 441 von 442 Segmenten in einen einzigen Cluster.

**Gegenprobe, bevor man dem Ergebnis glaubt:** Wer jemanden beim Namen nennt, ist
normalerweise nicht diese Person. In Folge 1 stimmten **17 von 17** Namensnennungen.
Zusätzlich ausweisen, wie viele Segmente keine klare Mehrheit hatten (hier 13 von 442) —
die gehören einzeln angesehen.

**Intro und Abspann sind keine Personen.** Sie werden von KI-Stimmen gesprochen und
bekommen ein eigenes Label; die Zeitgrenzen setzt man von Hand. Genau dort meldete die
Zuordnung von selbst niedrige Konfidenz.

---

## 8. Text korrigieren

Zwei Sorten Eingriff, und die Grenze ist wichtig, weil es Zitate sind:

- **Eigennamen und Fachbegriffe werden korrigiert.** Niemand hat „Cloud Code" oder
  „Agents MD" gesagt; der Erkenner hat bei Wörtern geraten, die er nicht kennt. In Folge 1
  waren es 20 Stellen: Anthropic, Claude Code, CLAUDE.md, Worktree, ImmoScout, Grok,
  Mistral, DeepSeek, ThinkPad, Stephan (nicht Stefan).
- **Gesprochene Sprache bleibt.** Füllwörter, abgebrochene Sätze, „also", „halt".
  Geglättete Zitate sind falsche Zitate.

- [ ] Jede Ersetzung mit Zeitmarke protokollieren, damit sie gegenlesbar ist
- [ ] Bei unklaren Stellen **nachfragen statt erfinden** — in Folge 1 waren „Auto-Accept
      Mode in Claude CLI" und „Ich liefere das Signal" geraten und mussten korrigiert
      werden
- [ ] Was unauflösbar bleibt, stehen lassen und benennen

---

## 9. Website

- [ ] Thumbnail aus der Titelgrafik ziehen (`ffmpeg -ss <sek> -i "$SRC" -frames:v 1`),
      nach `breakfast/folge-N.jpg`
- [ ] Unterseite `breakfast/folge-N.html` nach dem Muster von Folge 1
- [ ] Karte in der Sektion `.episodes` auf der Startseite ergänzen
- [ ] Version in **allen** HTML-Dateien hochziehen (Kommentar in Zeile 2 und Footer)
- [ ] Kapitel und Transkript-Zeitmarken sind Sprungmarken: mit JS springt der eingebettete
      Player, ohne JS öffnet der Link YouTube an derselben Sekunde
- [ ] Lokal prüfen: `python3 -m http.server`, dann Desktop **und** 375 px Breite

Die Unterseite nutzt `talks/talk.css` und `talks/talk.js` mit — dieselbe
DSGVO-Klick-Fassade und dasselbe GoatCounter-Snippet, keine Duplikate. Vor dem Klick geht
kein Request an YouTube; das gehört bei jeder Folge einmal nachgemessen.

**Merge-Reihenfolge:** Das Video muss auf „nicht gelistet" oder öffentlich stehen, **bevor**
der PR gemergt wird. Sonst zeigt die Einbettung Besuchern ein privates Video.

---

## 10. YouTube

- [ ] Custom-Thumbnail hochladen (die Titelgrafik)
- [ ] Beschreibung mit Kapitelmarken ab `00:00`
- [ ] Links auf Website, Company-Page und die vier LinkedIn-Profile
- [ ] **Musikcredit** — bei Folge 1: Chris Hülsbeck, Summer of Synth (Royalty-Free Music
      Vol. 2)
- [ ] Disclaimer: nicht-kommerzielle Community, keine Verbindung zu Anthropic oder zur
      ultrathink GmbH
- [ ] In die Playlist einsortieren

**Keine harten Zeilenumbrüche im Beschreibungstext.** YouTube bricht selbst um; wer bei
80 oder 90 Zeichen von Hand umbricht, bekommt auf schmalen Fenstern zerhackte Zeilen. Ein
Absatz ist eine Zeile, Absätze werden durch Leerzeilen getrennt. Dasselbe gilt für den
LinkedIn-Post.

---

## 11. LinkedIn

- [ ] 60 bis 90 Sekunden als nativen Ausschnitt schneiden, Untertitel einbrennen
      (Autoplay läuft stumm)
- [ ] Post von der Company-Page, Haken in Zeile 1
- [ ] **YouTube-Link in den ersten Kommentar**, nicht in den Post — externe Links im Post
      drücken die Reichweite
- [ ] Die vier Beteiligten markieren, drei bis fünf Hashtags

---

## 12. Podcast

Alle Verzeichnisse ziehen aus **einem** RSS-Feed; wir nutzen RSS.com (Gratis-Tarif,
unbegrenzte Folgen, verteilt automatisch).

- [ ] MP3 aus Schritt 4 (mono, 96 kbps, −16 LUFS)
- [ ] `podcast-cover.png` als Show-Cover
- [ ] Shownotes = YouTube-Beschreibung ohne Hashtags
- [ ] Kapitelmarken übernehmen

**Einmalig beim Anlegen:** Sprache Deutsch, Kategorie Technology, Explicit nein — und eine
**Owner-Mail, die öffentlich im Feed steht**. Dafür eine eigene Adresse nehmen, keine
private.

---

## Was wir nicht tun, und warum

**Die vier Einzelspuren direkt transkribieren.** Naheliegend — dann käme die
Sprecherzuordnung geschenkt. Es scheitert an zweierlei: Vier Spuren à 38 Minuten kosten
beim gemessenen Tempo gut sechs Stunden statt anderthalb, und die Spuren übersprechen,
sodass in jeder Spur alle vorkämen. Dazu läuft die Zoom-Zeitachse gegen die geschnittene:
Kapitelmarken müssen zur veröffentlichten Fassung passen.

Sobald alle mit Kopfhörern aufnehmen und der Gesprächsteil ungeschnitten bleibt, wird
dieser Weg der bessere.

**Die Rechenarbeit auslagern.** Ginge, kostet aber Geld und schickt das Gespräch an
Dritte. Solange eine Folge in anderthalb Stunden lokal durchläuft, bleibt es hier.
