Genussbibliothek – Arbeitsanweisungen für Codex

Projektziel

Dieses Repository enthält die WebApp „Genussbibliothek“.

Die produktiv ausgebauten Bereiche sind Whisky und Gin. Weitere Genussbereiche sollen später modular ergänzt werden.

Die Anwendung basiert auf:

* HTML5
* CSS3
* JavaScript (ES6)
* Supabase als Backend
* GitHub Pages für das Hosting

Es werden keine Frontend-Frameworks wie React, Vue oder Angular verwendet.

Grundregeln

1. Bestehende, funktionierende Features dürfen nicht ohne ausdrückliche Anweisung verändert oder entfernt werden.
2. Keine eigenmächtigen Refactorings außerhalb des jeweils beauftragten Bereichs.
3. Änderungen möglichst klein, nachvollziehbar und modular halten.
4. Bestehende Datei- und Ordnerstruktur respektieren.
5. Keine neuen Frameworks oder großen Abhängigkeiten einführen.
6. Keine Secrets, API-Schlüssel oder Service-Role-Keys in Dateien, Commits oder Logs schreiben.
7. Admin-Dateien und lokale Admin-Werkzeuge dürfen nicht Teil des öffentlichen Deployments werden.
8. Vor größeren Änderungen zuerst den bestehenden Code analysieren und Abhängigkeiten prüfen.
9. Keine Annahmen über Datenbankstruktur, Trigger, RLS oder Berechtigungen treffen, wenn diese nicht im Code oder Auftrag eindeutig ersichtlich sind.
10. Bei Unsicherheit nichts erfinden, sondern den unklaren Punkt benennen.

Supabase

Das Projekt nutzt Supabase für:

* Authentication
* PostgreSQL-Datenbank
* Storage
* Data API

Bestehende Tabellen, Trigger, Policies und Berechtigungen dürfen nicht ohne ausdrückliche Anweisung verändert werden.

Bei neuen Tabellen sind künftig explizite GRANTs sowie passende RLS-Policies zu berücksichtigen.

Lokale Supabase-Dokumentation

Vor jeder Arbeit an Schema, Triggern, Funktionen, RLS-Policies, Grants oder Storage muss – sofern im lokalen Arbeitsverzeichnis vorhanden – zuerst gelesen werden:

* admin/docs/SUPABASE_ARCHITECTURE.md
* admin/docs/SUPABASE_CHANGELOG.md

Jede tatsächlich ausgeführte Supabase-Änderung muss dort unmittelbar mit Datum, Zweck, ausgeführtem SQL, Prüfergebnis und Rückbauhinweis dokumentiert werden. Die zugehörigen SQL- und Rollback-Dateien liegen ausschließlich lokal unter admin/sql/ und dürfen nicht deployed werden.

In dieser Dokumentation dürfen niemals Secrets, Service-Role-Keys, Zugriffstokens oder personenbezogene Datensätze gespeichert werden.

Aktuelle Haupttabellen

Für den Whisky-Bereich insbesondere:

* gdb_whiskys
* gdb_whisky_user
* gdb_users
* gdb_user_permissions
* gdb_log

Für den Gin-Bereich insbesondere:

* gdb_gins
* gdb_gin_user

Architektur

Whisky-spezifische Views liegen unter:

/views/whisky/

Neue größere Funktionsbereiche sollen möglichst ebenfalls in eigenen Unterordnern unter /views/ aufgebaut werden.

Globale Logik soll nicht unnötig in gdb_index.js wachsen.

Design

Der bestehende Look soll grundsätzlich erhalten bleiben:

* dunkles, ruhiges Erscheinungsbild
* goldene Akzente
* klare Karten- und Panelstruktur
* keine übermäßigen Animationen
* Desktop und Mobilgeräte sollen gleichermaßen nutzbar sein

Aktuelle technische Prioritäten

1. Mobile Optimierung

Die bestehende Anwendung funktioniert auf Desktop gut, benötigt aber noch gezielte Optimierungen für Smartphones und kleinere Displays.

Wichtig:

* Desktop-Layout nicht verschlechtern
* bestehende Optik beibehalten
* responsive Anpassungen möglichst über gezielte Media Queries lösen

2. Bild- und Egress-Optimierung

Supabase Cached Egress war zuletzt deutlich zu hoch.

Daher:

* keine unnötig großen Originalbilder in Listenansichten laden
* Lazy Loading nutzen, wo sinnvoll
* mögliche Thumbnail-/Preview-Strategien prüfen
* unnötige Mehrfachabrufe vermeiden
* bestehende Bild-URLs nicht ohne Not verändern

3. Codebereinigung

Vorhandene Altlasten dürfen später gezielt entfernt werden, aber nur wenn klar ist, dass sie nicht mehr verwendet werden.

Insbesondere:

* alte oder doppelte News-/Fallback-Logik
* tote View-Logik
* veraltete Hilfsfunktionen

Nicht vorsorglich löschen, sondern Verwendung vorher prüfen.

Arbeitsweise

Bei jeder Aufgabe:

1. betroffene Dateien und Abhängigkeiten prüfen
2. nur den beauftragten Bereich ändern
3. bestehende Funktionalität erhalten
4. Änderungen nachvollziehbar halten
5. nach Änderungen auf offensichtliche Seiteneffekte prüfen

Keine stillen Zusatzänderungen.
