# Engineering Cockpit

**Klickbarer Entwurf online: https://mjung02.github.io/Engineering-Cockpit/**

Das ist ein **Entwurf zum Ausprobieren**, noch kein fertiges Tool:

- Alle Daten sind Beispieldaten (SM42 Schraubstation, Retrofit Linie 2, Prüfstand Drehmoment, Instandhaltung Halle 2).
- **Nichts wird gespeichert.** Neu laden setzt alles zurück. Jeder sieht seine eigene Kopie.
- KI-Assistent, Outlook und Mails sind simuliert.

## Was testen?

1. **Mein Tag / Meine Aufgaben:** Aufgaben anlegen, abhaken, verschieben, als privat markieren
2. **Projekte:** „+ Neues Projekt“ anlegen, Board, Gantt in der Planung, Team einladen, Change Requests, Meilenstein-Trend
3. **Teams:** Teamplanung über 6 Monate, Aufgaben per Ziehen verteilen, Standorte und Feiertage
4. **Posteingang:** Freigaben, Anfragen, Mail-Entwürfe mit KI überarbeiten
5. **Assistent** (unten rechts oder Strg+Umschalt+M): Aufgaben per Text anlegen, „Wo finde ich …?“

Auffälligkeiten bitte direkt im Entwurf melden: **„💬 Feedback geben“** (links unten oder auf der Startseite). Drei kurze Fragen (Was gemacht? Was erwartet? Was ist passiert?); Ort, Gerät und Version schreibt das Cockpit selbst dazu. Dann als Mail-Entwurf öffnen oder den Text kopieren, am besten mit Bildschirmfoto. **„✨ Was ist neu?“** zeigt die letzten Neuerungen mit „Ausprobieren →“.

## Zukunft (nach der Testphase)

- **Echtes Tool:** FastAPI und React mit Datenbank, Anmeldung über Entra ID, Rechten und Speichern.
- **Schnittstellen:** dokumentierte REST-API v1 und ein **MCP-Server**, damit KI-Assistenten und andere Systeme mit den Rechten des Nutzers lesen und schreiben können.
- **LPA-Tool:** Maßnahmen aus Layered Process Audits laufen automatisch als Aufgaben ins Cockpit. Statuswechsel und „erledigt“ werden in beiden Apps synchron gehalten und gegenvalidiert; bei Widerspruch gibt es einen Konflikt mit Klärungsaufgabe. Details in `docs/ANFORDERUNGEN.md`, REQ-INT-024 bis -032, und im Konzept `docs/LPA_ANBINDUNG.md`.

## Neu nach der siebten Testrunde (18.11.2026)

- **Einladungslinks** (Verwaltung › Einladungen, im Erst-Start unter Projekte und auf der Startseite „👥 Leute einladen“): Link für Firma, Team oder Projekt mit Rolle (auch „Gast“ für Kunden und Lieferanten), Gültigkeit (1, 7, 30 Tage), Nutzbarkeit (einmal, bis 10×, unbegrenzt), optional nur für eine Domain und mit Admin-Freigabe. Kopieren, per Mail schicken oder in neuem Tab testen. Wer den Link öffnet, sieht die Einladung auf der Anmeldeseite und tritt nach der Anmeldung direkt bei. Abgelaufene, aufgebrauchte oder widerrufene Links werden abgelehnt.
- **Erster Start erweitert:** Startseite mit neun Bausteinen (Schnell starten, Heute fällig, Überfällig, Nächste 7 Tage, Diese Woche, Meine Projekte, Nächste Termine, Notiz, Erste Schritte), verschiebbar und in der Breite änderbar. Projekte entstehen über denselben Assistenten wie im Beispiel (Vorgehensmodell, Vorlage, Stufe, Team) und sind vollwertig mit Board und Gantt. Meine Aufgaben zeigt eigene To-dos und Projektaufgaben gemeinsam.
- **Erster Start als neuer Nutzer** (links unten „🚀 Als neuer Nutzer starten“): Anmeldung mit E-Mail und Passwort, Apple, Google, Facebook oder Firmenkonto (SSO). Danach eine leere App: nur Start, Meine Aufgaben und Projekte, keine Projekte, keine Aufgaben, keine fertigen Dashboards; die Startseite richtet man sich selbst ein. Ohne Firma sind neue Projekte sofort aktiv, mit Firmenkonto gehen sie zur Freigabe. Ein interaktives Tutorial führt in fünf Schritten durch die Grundlagen. „↩ Zurück zu den Beispieldaten“ beendet den Modus. Anforderungen: REQ-ONB-001 bis -008.
- **Statusbericht mit Prognose:** Die Ampeln „Termine“ und „Kosten“ zeigen zusätzlich die Prognose (Ende mit Abweichung in Tagen, Gesamtkosten mit Abweichung zum Budget) und färben sich danach: ab +4 Tagen gelb, ab +15 Tagen rot; Mehrkosten gelb, über 5 % rot. Gilt im Cockpit, im Word-Export, in der Präsentation und in den Platzhaltern {{Termine}} und {{Kosten}}.
- **Projektsteckbrief** oben in der Projektübersicht: Auftrag (was ist zu tun), Ziel (woran messen wir den Erfolg) und Nutzen (warum, für wen). Darunter die Themen mit Hauptthema (★). Die Projektleitung ändert alles direkt im Projekt mit „✎ Bearbeiten“: Texte, Themen an- und abwählen, Hauptthema wechseln. Mindestens ein Thema bleibt Pflicht. Andere sehen den Steckbrief nur. Änderungen stehen im Verlauf. Portfolio und Priorisierung rechnen sofort mit den neuen Themen, die Portfolio-Liste zeigt das Ziel (🎯) unter dem Projektnamen. Der Steckbrief ist eine Kachel der Übersicht: mit „Übersicht anpassen“ verschieben, schmaler/breiter stellen, ausblenden und über „+ Projektsteckbrief“ zurückholen.
- **Aufgabenliste:** Gliederungsnummer vor jeder Aufgabe (T2.2.2) und vor dem Meilenstein (M2.2).
- **Gliederungsnummern im Plan:** P1 = Phase 1, M1.2 = Meilenstein 2 in Phase 1, QG2.1 = erstes Quality Gate in Phase 2, T2.2.1 = Aufgabe 1 an M2.2 (an Gates: TG…). Untermeilensteine und Unterphasen hängen eine Stufe an (M2.1.1, P1.1). Zu sehen im Gantt, im Detail, in den Abhängigkeiten („nach QG1.1 Gate G1“) und an jeder Aufgabe. Die Nummern ergeben sich aus der Reihenfolge im Plan.
- **V-Modell:** Arbeitspakete und Testfälle einer V-Ebene sind im Detail anklickbar und öffnen die Aufgabe.
- **Aufgabendetail:** Projekt, Bucket, Priorität und „Fällig am“ wurden bei langen Aufgaben zusammengedrückt und waren nicht zu sehen. Behoben.
- **Termine verschieben, mit System:**
  - **Zwei Daten je Projektaufgabe:** *Fällig* ist die Zusage im Projekt, *Geplant am* ist dein Arbeitstag. Den Arbeitstag änderst du immer frei, ohne Freigabe.
  - **Eigene To-dos** (ohne Projekt, Team): Fälligkeit frei verschiebbar.
  - **Projektaufgaben:** früher geht immer; bis 3 Tage später ohne Freigabe (die Projektleitung wird informiert); mehr oder hinter den zugehörigen Meilenstein braucht die Freigabe der Projektleitung, mit Grund. Bis zur Entscheidung gilt der alte Termin. Die Projektleitung stellt die Toleranz im Projektkalender ein (immer Freigabe, 3, 5 oder 10 Tage) und entscheidet über die Glocke oder im Aufgabendetail.
  - **Kalender:** Aufgaben per Ziehen auf einen anderen Tag legen, auf dem Handy mit „⇄ Tippen zum Verschieben“. In *Meine Arbeit* plant das den Arbeitstag um, im Projektkalender ändert es die Fälligkeit nach den Regeln oben. Jeder Tag zeigt deine eingeplanten Stunden, rot über 6 h. „⚖ Überlastete Tage ausgleichen“ verteilt auf Tage mit Luft, jeweils vor der Fälligkeit.
- **Beispielplan SM42 neu aufgebaut:** Jede Phase hat Meilensteine (auch parallel) und endet mit einem Quality Gate oder Abschluss-Meilenstein; die nächste Phase hängt an diesem Gate, nicht mehr Phase an Phase. Parallele Meilensteine laufen beide ins Gate. Die Beschaffung ist bewusst vorgezogen und startet vor Gate G2 (nach der Mechanik-Konstruktion). Bei eingeklappten Phasen setzen die Pfeile an der Phasenzeile an.
- **Handy:** Die Benachrichtigungen (Glocke) gehen über die volle Breite statt links abgeschnitten.
- **Word-Berichte** (Export › „📝 Word-Bericht …“): Statusbericht, Abnahmeprotokoll, Abschlussbericht und Besprechungsprotokoll als .docx (A4, mit Tabellen und Seitenzahl).
  - **Eigene Vorlage:** Firmen-Briefkopf als .docx hochladen. Platzhalter wie {{Projekt}}, {{Ergebnis}} oder {{OffenePunkte}} werden ausgefüllt, auch in Kopf- und Fußzeile. Steht {{Inhalt}} allein in einer Zeile, setzt das Cockpit dort den ganzen Bericht ein. Je Berichtsart gibt es eine Mustervorlage mit allen Platzhaltern.
  - Direkt aus dem Projekt: „📝 Als Word“ im Statusbericht, „📝 Abnahmeprotokoll (.docx)“ nach der Abnahme, „📝 Als Word (.docx)“ beim Abschlussbericht. In Besprechungen: „📝 Als Word (.docx)“ neben „Protokoll an Teilnehmer senden“.
- **Integrationen** (Verwaltung › „Integrationen“): Simulation der LPA-Anbindung als Vorgeschmack auf REQ-INT-026 bis -029.
  - „⇄ Jetzt abgleichen“ übernimmt die offenen Maßnahmen aus dem LPA-Tool als Aufgaben, mit externer ID, Befund und Frist. Sie erscheinen in Meine Arbeit, im Team und im Projekt. Bereits erledigte werden nicht übernommen, doppelt wird nichts angelegt.
  - **Gegenvalidierung:** Erledigt im Cockpit wird gemeldet und wartet auf die Bestätigung durch den Auditor. Lehnt er ab, ist die Aufgabe wieder offen und es entsteht eine Klärungsaufgabe.
  - **Konflikte:** Meldet das LPA-Tool „erledigt“, die Aufgabe ist im Cockpit aber offen: übernehmen oder Klärungsaufgabe. Neue Befunde kommen per Webhook automatisch.
  - Sync-Monitor mit Kennzahlen (übernommen, synchron, wartet, Konflikte) und Protokoll. Karten für REST-API v1 und MCP-Server (geplant).
  - **Nach der echten LPA-API (18.11.):** neue Maßnahmen mit `nur_neue` holen und per `uebertragen` quittieren, Erledigt als DONE melden, der Auditor bestätigt mit VERIFIED („nicht wirksam“ öffnet wieder), Änderungen per Webhook oder `seit`, Verworfen (REJECTED). „{ } API-Aufrufe zeigen“ blendet die Aufrufe im Protokoll ein. Konzept für das echte Tool: `docs/LPA_ANBINDUNG.md`.
- **Plan gegen Ist mit Prognose** (Statusbericht, Kurzfassung unter Finanzen): Geplant bis heute, Erreicht und Kosten verbraucht als Balken. Dazu Termintreue und Kostentreue (Earned Value), Prognose für Ende und Gesamtkosten im aktuellen Tempo und eine Kurve geplant / heute / Prognose. „So rechnet das Cockpit“ erklärt die Rechnung. Auch als Platzhalter {{PlanIst}} für PowerPoint und Word.

## Neu nach der sechsten Testrunde (17.11.2026)

- **Abhängigkeiten als Standard:** Nachfolger hängen automatisch an ihrem Vorgänger (gleiche Ebene, in zeitlicher Reihenfolge). Lösen mit ✕ im Detail unter „Abhängigkeiten“. Ein Nachfolger lässt sich nicht vor das Ende seines Vorgängers schieben. Die Pfeile laufen senkrecht auf den Nachfolger, in Blau, auf dem kritischen Pfad in Rot.
- **Rückfrage vor dem Löschen:** Bei Spalten, Projekten, Papierkorb, Risiken, Etiketten, Rollen, Mitgliedern, Kontakten, Abwesenheiten, Ansichten und Vorlagen fragt ein Pop-up „Wirklich löschen?“.
- **Teams-Dashboard anpassbar:** „⚙ Dashboard anpassen“ blendet Tagesplanung, Kapazität, Team-Eingang, Qualifikationsmatrix und Zertifikate ein und aus. Bereiche lassen sich ziehen, auf halbe oder ganze Breite stellen und mit ✕ ausblenden.
- **Hinweise aus früheren Projekten** in der Projektübersicht als kompakte Zeile, aufklappbar mit „Anzeigen ▾“.
- **Abhängigkeiten als Pfeile im Gantt** (wie bei monday.com): Vom Ende des Vorgängers zum Anfang des Nachfolgers, auf dem kritischen Pfad rot. Verlängert sich ein Vorgänger über den Puffer hinaus, rücken die Nachfolger nach. Jede Terminänderung steht im Verlauf.
- **„Mehr ▾“ in der Reiterleiste:** Zeiten, Kapazität, Statusbericht, Offene Punkte, Change Requests, Abschluss und Verlauf stehen im Menü „Mehr“. Der gewählte Reiter bleibt sichtbar. Auf dem Handy bleiben alle in der Wischleiste.
- **Was hat sich seit letzter Woche geändert?** Steht im Statusbericht und als Folie in der Präsentation, automatisch aus dem Verlauf: verschobene Termine, neue Risiken, Erledigtes, Entscheidungen. Platzhalter {{Aenderungen}}.
- **Automatischer Versand:** Im Statusbericht „jeden Freitag 14:00“ per E-Mail oder in den Teams-Kanal, wahlweise mit Präsentation. Im Entwurf nur angedeutet.
- **Gate-Unterlagen auf Knopfdruck:** Am Quality Gate erzeugt „📦 Gate-Unterlagen“ sechs Folien: Titel, Checkliste, Stand bis zum Gate, offene Punkte und Risiken, Entscheidungsvorlage mit Empfehlung, Protokollvorlage. Die Entscheidung kommt danach unter „Gate-Entscheidung“ ins Cockpit.
- **Lenkungskreis-Deck** (Berichte): Portfolio-Übersicht, eine Folie je Projekt mit Ampel, Ressourcenkonflikte im Bereich, gesammelter Entscheidungsbedarf.
- SM42: Phase Konstruktion endet jetzt am 10.11., damit Gate G2 innerhalb der Phase liegt.
- **PowerPoint aus dem Projekt** (Export › „📽 Präsentation (PowerPoint)“):
  - **Foliensatz erzeugen:** Titel, Status mit Ampeln, Termine als Gantt, Meilensteine, offene Aufgaben, Team und Zuständigkeiten, Kosten als echtes PowerPoint-Diagramm, Risiken, offene Punkte und Entscheidungen, nächste Schritte. Folien einzeln an- und abwählbar.
  - **Eigene Vorlage (.pptx) hochladen:** Das Cockpit übernimmt Farben, Schriften und Logo. Enthält die Vorlage Platzhalter wie {{Projekt}}, {{Ampel}} oder {{OffeneAufgaben}}, füllt „Meine Vorlage ausfüllen“ sie direkt in den eigenen Folien aus. Eine Mustervorlage mit allen 24 Platzhaltern gibt es zum Herunterladen.
  - Läuft komplett im Browser mit PptxGenJS und JSZip (MIT-Lizenz, liegen im Ordner `vendor/`). Die Vorlage bleibt im Entwurf nur bis zum Neuladen erhalten.
- **Hinweise aus früheren Projekten (Lessons Learned):**
  - **Beim Anlegen:** Der Assistent „Neues Projekt“ schlägt passend zu Name, Vorlage, Phasen und Startaufgaben Lessons Learned anderer Projekte vor. Mit „+ Beim Anlegen als Aufgabe“ wird daraus gleich eine Aufgabe.
  - **Während des Projekts:** In der Übersicht stehen Hinweise passend zu den Phasen, Meilensteinen und Aufgaben der nächsten 60 Tage, mit Knöpfen „Als Aufgabe übernehmen“, „👍 hilfreich“ und „Nicht relevant“.
  - Jeder Hinweis zeigt, woher er kommt und warum er passt („passt zu: Schutzzaun“). Lessons Learned aus dem eigenen Projekt werden nicht vorgeschlagen.
- **Export** (Knopf „⤓ Export“ neben ⚙ im Projektkopf):
  - Aufgaben, Termine/Gantt sowie offene Punkte und Entscheidungen als Excel-Datei (CSV mit Semikolon, öffnet direkt in Excel).
  - Gantt als PDF über Drucken › „Als PDF sichern“. Navigation und Bedienelemente werden dabei ausgeblendet.
- **Projektabschluss** (neues Modul ab Stufe 2, Reiter „Abschluss“), fünf Schritte:
  1. **Abnahme:** Abnahmeprotokoll mit Datum, Abnehmer und Ergebnis. Restpunkte werden offene Punkte mit Frist.
  2. **Was ist noch offen?** Aufgaben, offene Punkte, Change Requests und Risiken, mit Knöpfen zum Schließen oder Entscheiden.
  3. **Lessons Learned:** Pflicht sind mindestens je eine „lief gut“ und „verbessern“. Sie landen automatisch unter Wissen.
  4. **Abschlussbericht:** Plan gegen Ist für Termin und Kosten, Aufgaben, Nachträge, Entscheidungen.
  5. **Abschließen und archivieren:** erst möglich, wenn Abnahme und Lessons Learned vorliegen. Wieder öffnen geht jederzeit.
- **Offene Punkte und Entscheidungen** (neues Modul ab Stufe 2, Reiter „Offene Punkte“):
  - **Offene-Punkte-Liste:** wer, was, bis wann. Filter Offen, Überfällig, Alle. Abhaken, und mit einem Klick „→ Aufgabe“.
  - **Entscheidungslog:** was, warum, wer, wann. Einträge bleiben unverändert.
  - **Aus Besprechungen:** Meine Arbeit › Besprechungsnotizen › „Ins Projekt übernehmen“ legt Beschlüsse ins Entscheidungslog und offene Maßnahmen als offene Punkte an.
  - Alles steht auch im Verlauf (Audit).
- **Ressourcenkonflikte über Projekte hinweg:** Das Cockpit rechnet je Person und Woche (KW 47–52) die Grundlast aus der Linie, die Aufgaben aller Projekte und die Abwesenheiten zusammen.
  - Wer über seine planbare Zeit (32 h/Woche) kommt, steht mit Aufteilung nach Projekt in der Liste.
  - Der Vorschlag nimmt eine Aufgabe aus dem Projekt mit der niedrigsten Priorität. Sie lässt sich um eine Woche verschieben oder an eine Kollegin bzw. einen Kollegen mit Luft im selben Projekt geben.
  - Zu sehen unter Berichte › Ressourcenkonflikte (ganzer Bereich) und im Projekt-Reiter Kapazität (Personen des Projekts).
- **Abhängigkeiten im Gantt:** Im Detail jedes Elements legst du unter „Abhängigkeiten · beginnt nach“ mit „+ Vorgänger“ fest, was vorher fertig sein muss (Ende → Anfang). Im Gantt steht dann „↳ nach …“ unter dem Namen.
  - Verschiebt sich ein Vorgänger nach hinten, rücken die Nachfolger automatisch mit. Die Meldung nennt, wer um wie viele Tage gerückt ist.
  - Passt ein Nachfolger dadurch nicht mehr in seine Phase, meldet das Cockpit einen Konflikt.
  - Kreise (A nach B nach A) lassen sich nicht anlegen.
- **Kritischer Pfad:** Rot umrandete Balken liegen ohne Puffer auf der Kette zum spätesten Termin. Verzögern sie sich, verschiebt sich das Ende.
- **Meilenstein von–bis auch in eigenen Projekten:** Im Reiter Planung gibt es beim Anlegen „Meilenstein (Termin)“ und „Meilenstein (von–bis)“.
- **Quality Gates als ▣** jetzt auch in der Meilenstein-Zeitleiste und im Gantt der eigenen Projekte.
- Die Reiter Risiken, Zeiten, Kapazität, Statusbericht, Change Requests und Verlauf sind ins Englische, Spanische, Polnische und Türkische übersetzt.

## Neu nach der fünften Testrunde (17.11.2026)

- **Meilenstein als Termin oder Zeitraum:** Im Detail eines Meilensteins schaltest du unter „Art“ zwischen „◆ Termin (Stichtag)“ und „▬ Zeitraum (von–bis)“ um. Beim Anlegen gibt es „Meilenstein (Termin)“ und „Meilenstein (von–bis)“.
- Die Meldung vom Anlegen verschwindet, wenn du ein anderes Element öffnest.
- **Gantt-Grenzen:** Ein Untermeilenstein liegt immer im Zeitraum seines Meilensteins, ein Meilenstein immer in seiner Phase.
  - Verschieben, Verlängern und Datumseingaben stoppen an der Grenze, und eine Meldung nennt die Grenze.
  - Die übergeordnete Phase ändert sich dabei nicht mehr.
  - Eine Phase lässt sich nicht kürzer machen als ihr Inhalt.
  - Neu angelegte oder in eine Phase gezogene Elemente werden in deren Zeitraum gelegt.
- **Meilenstein und Quality Gate** sehen im Gantt verschieden aus: Ein Meilenstein ist eine Raute ◆, ein Gate ein Quadrat ▣ mit „G“.
- **Stacey-Hilfe im Assistenten:** standardmäßig eingeklappt („Hilfe bei der Wahl des Vorgehensmodells“). Die Fragen nennen jetzt die Achse (senkrecht: Anforderungen, waagrecht: Lösung/Technik).
- **Vorlagen:** Suchfeld und zunächst nur 4 Vorschläge, mit „Alle anzeigen“. Das bleibt auch bei vielen Vorlagen übersichtlich.
- **Mitglieder beim Projekt anlegen:** Suche über alle 500 Kolleginnen und Kollegen (Name oder Team). Ausgewählte stehen als Chips mit ✕, dazu Vorschläge aus dem eigenen Team.
- **AKV:** Die Normalansicht ist eine lesbare Tabelle oder ein Diagramm mit Karten je Person. Bearbeiten geht nur über ✎ (nur Owner), mit „Speichern“ und „Abbrechen“.
- **KI-Knopf:** ist jetzt ein runder Knopf. Ist rechts ein Panel offen, wandert er nach links unten. Unter dem Seiteninhalt bleibt Platz, damit er keine Knöpfe verdeckt.

## Neu nach der vierten Testrunde (17.11.2026)

- **Module mit eigener Funktion:** Jedes zugeschaltete Modul bekommt einen eigenen Reiter im Projekt.
  - **Risiken:** Register mit Bewertung, Maßnahme, Verantwortlichem, Status und Risikomatrix (statt der Stacey-Matrix).
  - **Zeiten:** Buchen auf Aufgaben, Summe je Person, Wochenzettel einreichen.
  - **Kapazität:** Auslastung je Person für die nächsten 4 Wochen, Warnung bei Überplanung, Ausgleich mit einem Klick.
  - **Statusbericht:** Ampeln aus den Daten, Texte vorbefüllt, Bericht senden.
  - **Change Requests:** einreichen, genehmigen oder ablehnen; genehmigte Mehrkosten stehen als Nachtrag unter Finanzen.
  - **Verlauf (Audit):** alle Änderungen im Projekt, filterbar, Export als CSV.
- **Anforderungen und Testfälle** lassen sich nur im V-Modell einschalten.
- **Stacey-Matrix:** im Assistenten „Neues Projekt“ sofort sichtbar und anklickbar. In bestehenden Projekten steht sie unter ⚙ › Vorgehensmodell.
- **Finanzen:** zeigen Kostenstelle und Innenauftrag. Beides pflegst du unter ⚙ › Stammdaten.
- **Team-Reiter:** neue Bereiche Auslastung, Abwesenheiten (mit Warnung bei fälligen Aufgaben) sowie Kontakte und Stakeholder. Über „⚙ Ansicht anpassen“ ziehst du Bereiche am ⠿, stellst halbe oder ganze Breite ein und blendest sie mit ✕ aus.
- **„+ Neu“ außerhalb eines Projekts:** nur Aufgabe, Projekt und Projektantrag. Meilensteine, Gates und Phasen legst du im Projekt an.
- **Handy:** Der Projektkopf ist kompakt, und das ⚙ steht neben dem Namen. Aufgabenlisten erscheinen als Karten. Der gewählte Reiter rutscht automatisch in Sicht. Der ✨-Knopf verdeckt nichts mehr. Die Teamplanung läuft nicht mehr über den Rand.

## Neu nach der dritten Testrunde (17.11.2026)

- **Vorgehensmodell wechseln wirkt:** Scrum stellt das Board auf Product Backlog, Sprint-Backlog, In Arbeit, Review, Done um und legt 4 Sprints an; V-Modell legt die Ebenen mit Gates an und schaltet Anforderungen und Testfälle ein; Wasserfall legt Phasen mit Gates an; Kanban stellt das Board um; Liste blendet die Planung aus. Vorhandene Phasen bleiben.
- **Planung:** ⠿ ziehen ändert die Reihenfolge, auf eine Phase gezogen landet ein Meilenstein oder Gate darin. „+“ an jeder Phase bereitet das Anlegen vor, Enter legt an.
- **Eigene Rollen** benennen und löschen (⚙ › Mitglieder, Rollen und Rechte).
- **Etiketten** erklärt, eigene anlegen und löschen (⚙ › Etiketten).
- **Team-Reiter** in jedem Projekt immer sichtbar; Bereiche ein-/ausblenden und ordnen (⚙ Ansicht anpassen). In den Beispielprojekten lassen sich die übrigen Reiter für sich ausblenden (⚙ Meine Reiter).
- **Berichte:** Reiter per Ziehen ordnen, über ⚙ ausblenden.
- **Vorlagen verwalten** im Assistenten: eigene löschen, mitgelieferte ausblenden.
- **Handy (iPhone):** Kopfzeile in einer Zeile, Reiter wischbar, größere Schrift, kein Zoom in Eingabefeldern, Assistent als runder Knopf, Nachrichten im Posteingang als Vollbild, „Die nächsten 5 Arbeitstage“ untereinander mit „⇄ Verschieben“ und „⤓ Hierher“ statt Ziehen.

## Neu nach der zweiten Testrunde (17.11.2026)

- **Handy:** Menü hinter ☰ (Hamburger), Inhalte rücken zusammen.
- **Menü anpassen:** Projekte, Teams, Wissen, Berichte, Posteingang einzeln ausblendbar (⚙ Menü anpassen bzw. Profil › Darstellung).
- **Meine Arbeit:** Reiter in der Reihenfolge Meine Aufgaben, Fokus, Mein Tag planen, Besprechungsnotizen; alle außer Meine Aufgaben ausblendbar (⚙). „Liste zeigen: Überfällig · Heute · Im Plan · Erledigt“ steht direkt über der Liste.
- **Dashboard:** Klick auf Überfällig/Heute/… öffnet Meine Aufgaben schon gefiltert; Klick auf eine Nachricht öffnet sie im Posteingang. Kacheln (Start, Projektübersicht) und Themen lassen sich jederzeit per Ziehen umordnen.
- **Checklisten:** Jeder Punkt hat eine Dauer, ☆ legt ihn als eigene Aufgabe in den Fokus, 🕘 plant ihn früh, mittags, nachmittags oder morgen ein.
- **Prioritätsfarben** im Profil frei wählbar; Details öffnen standardmäßig als Pop-up (umschaltbar).
- **Posteingang** mit Unterreitern (Nachrichten, Neue Aufgaben, Entwürfe); **Wissen** und **Mein Tag** mit zugeklappten Zusatzbereichen.
- **Neues Projekt:** Stacey-Matrix direkt im Assistenten mit Empfehlung; Hinweis, ob eine Freigabe nötig ist. Vorgehensmodell im Projekt wechselbar (⚙ › Vorgehensmodell).
- **Sichtbarkeit:** Owner legt je Rolle fest, welche Reiter sichtbar sind (⚙ › Sichtbarkeit der Reiter, mit „Ansicht testen als“); jeder blendet für sich Reiter aus (⚙ Meine Reiter).
- **RACI/AKV** auch ohne Phasen nutzbar (eigene Zeilen); **Personensuche** über alle 500 Kollegen beim Einladen und beim Vergeben von Aufgaben.

## Neu nach der ersten Testrunde (16.11.2026)

- **Termine direkt ändern:** In der Planung stehen Beginn, Ende und Termin als Datumsfelder in der Spalte „Termin“ (für Owner und Bearbeiter). Fälligkeiten in der Aufgabenliste ebenso.
- **Zeitstrahl:** beginnt einen Monat vor dem frühesten Termin; „‹ früher“ und „später ›“ blättern weiter.
- **Anlegen in der Planung:** Phase mit Beginn und Ende, Meilenstein mit Termin, Quality Gate mit „Fällig am“; Zuordnung zur Phase wählbar, die Phase verlängert sich bei Bedarf.
- **AKV** im Reiter Team (eigene Projekte): Aufgaben, Kompetenzen, Verantwortung je Person, verknüpft mit RACI und Freigabegrenze.
- **Rechnungen** im Reiter Finanzen: einreichen mit Beleg, Freigabe nach AKV (bis zur eigenen Grenze selbst, darüber Projektleitung bzw. H. Lorenz), freigegebene Rechnungen zählen ins Ist.
- **Scrum (Retrofit Linie 2):** „Sprint 5 starten“ funktioniert; die Retrospektive ist erklärt, Karten und Maßnahmen lassen sich anlegen, Maßnahmen werden Aufgaben.
- **Kanban (Instandhaltung Halle 2):** „+ Auftrag“ in jeder Spalte, „Störung melden“, Karte anklicken zum Bearbeiten, Spalten anlegen, umbenennen, verschieben, löschen, WIP-Limit per Klick auf die Zahl.

## Ordner

| Ordner / Datei | Inhalt |
|---|---|
| `index.html`, `app.js`, `dc-runtime.js` | die Seite für GitHub Pages |
| `entwurf/` | Quelle des Entwurfs (`Main.dc.html`) und Werkzeuge (`build_pages.py`, `pack.py`, Selbsttest, v2-Umsetzer) |
| `docs/` | Anforderungen, User Stories, Handbuch |
| `v2_streamlit/` | bisherige App v2.0 (Streamlit), ohne `.env`, KI-Modell und Datenbank |

## Aktualisieren

1. `python entwurf\pack.py` im Projektordner ausführen → Ordner `github_upload/` ist neu gebaut.
2. Inhalt von `github_upload/` ins Repository legen (git push oder GitHub › *Add file › Upload files*).
3. Nach ca. 1 Minute ist https://mjung02.github.io/Engineering-Cockpit/ aktuell (ggf. Strg+F5).

GitHub Pages einmalig einschalten: *Settings › Pages › Deploy from a branch › main / (root)*.

## Nicht ins Repository

`.env` (Passwörter), `models/*.gguf` (KI-Modell, 2,3 GB), `.venv`, Datenbanken und echte Projektdaten (`v2_export`, `cockpit_import.json`). Die `.gitignore` verhindert das.
