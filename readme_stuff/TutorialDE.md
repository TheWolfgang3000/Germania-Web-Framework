# GERMANIA WEB FRAMEWORK - Modul-Erstellungs-Guide

[cite_start]Diese Anleitung zeigt dir Schritt für Schritt, wie du ein neues Feature-Modul in das Framework integrierst[cite: 3].

## Schritt 1: Ordnerstruktur anlegen
1. [cite_start]Gehe in den Ordner `/modules/`[cite: 3].
2. [cite_start]Erstelle dort einen neuen Ordner für dein Feature (z. B. `/modules/mein_modul/`)[cite: 7].
3. [cite_start]Erstelle innerhalb dieses Ordners zwingend eine Datei namens `router.js`[cite: 8].
4. [cite_start]Wenn dein Modul eigene HTML/EJS-Seiten anzeigen soll, erstelle zusätzlich den Ordner `/modules/mein_modul/views/`[cite: 14, 26].

## Schritt 2: Die `router.js` konfigurieren
[cite_start]Jedes Modul benötigt einen Express-Router und einen festgelegten URL-Präfix[cite: 9]. [cite_start]Der Export muss exakt wie folgt aussehen[cite: 11]:

```javascript
const express = require('express');
const path = require('path');
const Logger = require('../../core/Logger'); [cite_start]// Empfohlen für saubere Logs [cite: 17]

const router = express.Router();

// Basis-Route: Erreichbar unter localhost:3000/mein_modul/
router.get('/', (req, res) => {
    res.send("Modul läuft!");
});

[cite_start]// ZWINGEND ERFORDERLICHES EXPORT-FORMAT [cite: 11]
module.exports = {
    prefix: '/mein_modul', // Basis-URL des Moduls
    router: router
};
```

## Schritt 3: Frontend-Ansichten (EJS) rendern
[cite_start]Da Module isoliert sind, musst du beim Rendern immer den absoluten Pfad zu deinem lokalen `views`-Ordner angeben[cite: 13, 15]:

```javascript
const viewsPath = path.join(__dirname, 'views'); // [cite: 15]

router.get('/seite', (req, res) => {
    // Rendert die Datei /modules/mein_modul/views/index.ejs [cite: 16]
    res.render(path.join(viewsPath, 'index.ejs'), {
        user: req.session ? req.session.user : null
    });
});
```

## Schritt 4: Best Practices
* **Bilder & CSS:** Nutze den globalen `/public/`-Ordner. [cite_start]Verlinke Bilder in deinen EJS-Dateien einfach mit `/assets/bildname.png`[cite: 27].
* **Logging:** Nutze niemals `console.log`. [cite_start]Importiere den Core-Logger und nutze `Logger.info()`, `Logger.warn()`, etc[cite: 18].
* [cite_start]**Globale Daten:** Wenn du z.B. die `stats.json` lesen willst, navigiere von der `router.js` zwei Ebenen zurück: `path.join(__dirname, '../../stats.json')`[cite: 23].