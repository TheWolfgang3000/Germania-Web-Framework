# GERMANIA WEB FRAMEWORK - Dokumentation

## 1. System Architektur & Übersicht
Dieses System ist eine modulare Express.js Web-Engine. Der Core (`core/WebServer.js` & `core/WebModuleLoader.js`) kümmert sich um die Initialisierung von Express, Body-Parsing, Session-Management und statische Dateien. Jedes Feature der Webseite (Wiki, Auth, Shop, Forum etc.) lebt isoliert als eigenständiges Modul im Ordner `/modules/`. Der WebModuleLoader scannt diesen Ordner beim Start und hängt alle gefundenen `router.js` Dateien automatisch in das Express-Routing ein.

## 2. Globale Ordnerstruktur
Die Engine folgt einer strikten Verzeichnisstruktur, um Kernlogik von Feature-Modulen zu trennen:
* **`core/`**: Beinhaltet WebServer, Modul-Loader und den globalen Logger.
* **`modules/`**: HIER LEBEN DIE MODULE (z. B. `auth/`, `core_pages/`, `wiki/`). Dies umfasst auch komplexe Module mit eigenen Routen und Daten.
* **`public/`**: Globale statische Dateien. Darunter fallen Bilder unter `assets/` und globale Stylesheets wie `style.css`.
* **Daten-Dateien**: `stats.json` und `users.json` speichern globale Core-Daten, die von allen Modulen lesbar sind.
* **`index.js`**: Der Startpunkt der Engine.

## 3. Ein neues Modul erstellen
Um ein neues Modul (z. B. `shop`) zu erstellen, folge diesen strikten Regeln:

### A. Ordner & Router anlegen
* Erstelle einen Ordner unter `/modules/DeinModulName/`.
* In diesem Ordner MUSS eine Datei namens `router.js` liegen.

### B. Aufbau der `router.js`
Jedes Modul muss einen Express-Router und einen URL-Präfix exportieren. Der Export MUSS zwingend dieses exakte Format aufweisen:

```javascript
const express = require('express');
const path = require('path');
const router = express.Router();

// Beispiel-Route
router.get('/', (req, res) => {
    res.send("Willkommen im Shop!");
});

// WICHTIG: Der Export MUSS genau dieses Format haben!
module.exports = {
    prefix: '/shop', // Die Basis-URL für dieses Modul (z.B. localhost:3000/shop)
    router: router
};
```

## 4. EJS Views & Rendering in Modulen
Die Engine nutzt `EJS` als Template-Engine. Da Module isoliert sind, dürfen sie sich nicht auf einen globalen `/views` Ordner verlassen. 
* Jedes Modul bringt seine eigenen EJS-Dateien in einem lokalen Unterordner mit (z. B. `/modules/shop/views/`).
* Beim Rendern MUSS der absolute Pfad zur lokalen EJS-Datei übergeben werden:

```javascript
const viewsPath = path.join(__dirname, 'views');

router.get('/items', (req, res) => {
    // Rendert die Datei /modules/shop/views/items.ejs
    res.render(path.join(viewsPath, 'items.ejs'), { 
        data: "Some Data",
        user: req.session ? req.session.user : null 
    });
});
```

## 5. Globale Tools & Abhängigkeiten

### Logging (`core/Logger.js`)
Nutze immer den globalen Logger anstelle von `console.log`.
* Verfügbare Methoden: `Logger.info`, `Logger.warn`, `Logger.error`, `Logger.success`.

### Sessions & Authentifizierung
Die Engine nutzt `express-session`. Das `auth`-Modul schreibt den eingeloggten Benutzer in `req.session.user`. 
* Wenn eine Route geschützt werden soll, schreibe eine kleine lokale Middleware:

```javascript
function requireLogin(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/login');
}

router.get('/geheim', requireLogin, (req, res) => {
    res.send("Hallo " + req.session.user.username);
});
```

### Globale Daten lesen/schreiben (z. B. users.json, stats.json)
Wenn ein Modul auf Konfigurationsdateien im Hauptverzeichnis zugreifen muss, MUSS der Pfad ausgehend vom Modul-Router aufgelöst werden.

```javascript
const fs = require('fs');
const path = require('path');

// Geht von /modules/shop/router.js zurück ins Root-Verzeichnis
const statsPath = path.join(__dirname, '../../stats.json');
const globalStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
```

## 6. Zusammenfassung für KI-Agenten
Wenn du den Auftrag erhältst, ein Feature zu dieser Seite hinzuzufügen:
1. Fasse die `core/WebServer.js` oder `index.js` NICHT an.
2. Erstelle einen isolierten Ordner in `/modules/`.
3. Erstelle dort die `router.js`, exportiere `prefix` und `router`.
4. Lege modulspezifische HTML/EJS Dateien in `/modules/DeinModul/views/` ab.
5. Nutze `res.render(path.join(__dirname, 'views', 'file.ejs'))`.
6. Referenziere statische Bilder via `/assets/...` (diese liegen in `/public/assets`).