# [cite_start]GERMANIA WEB FRAMEWORK - Documentation

## 1. System Architecture & Overview
[cite_start]This system is a modular Express.js web engine[cite: 1]. [cite_start]The core (`core/WebServer.js` & `core/WebModuleLoader.js`) handles the initialization of Express, body-parsing, session management, and static files[cite: 2]. [cite_start]Each feature of the website (Wiki, Auth, Shop, Forum, etc.) lives isolated as an independent module in the `/modules/` folder[cite: 3]. [cite_start]The WebModuleLoader scans this folder on startup and automatically hooks all found `router.js` files into the Express routing[cite: 4].

## [cite_start]2. Global Directory Structure [cite: 5]
The engine follows a strict directory structure to separate core logic from feature modules:
* **`core/`**: Contains the WebServer, Module Loader, and the global Logger.
* **`modules/`**: THIS IS WHERE THE MODULES LIVE (e.g., `auth/`, `core_pages/`, `wiki/`). [cite_start]This includes complex modules with their own routes and data[cite: 6].
* **`public/`**: Global static files. This includes images accessible via `assets/` and global stylesheets like `style.css`.
* [cite_start]**Data files**: `stats.json` and `users.json` store global core data that can be read by all modules[cite: 7].
* **`index.js`**: The entry point of the engine.

## 3. Creating a New Module
To create a new module (e.g., `shop`), follow these strict rules:

### A. Create Folder & Router
* Create a folder under `/modules/YourModuleName/`.
* [cite_start]Inside this folder, there MUST be a file named `router.js`[cite: 8].

### B. Structure of `router.js`
[cite_start]Every module must export an Express router and a URL prefix[cite: 9]. The export MUST strictly follow this exact format:

```javascript
[cite_start]const express = require('express'); [cite: 9]
[cite_start]const path = require('path'); [cite: 9]
[cite_start]const router = express.Router(); [cite: 9]

// Example Route
[cite_start]router.get('/', (req, res) => { [cite: 10]
    [cite_start]res.send("Welcome to the Shop!"); [cite: 10]
[cite_start]}); [cite: 10]

[cite_start]// IMPORTANT: The export MUST have exactly this format! [cite: 11]
[cite_start]module.exports = { [cite: 11]
    [cite_start]prefix: '/shop', // The base URL for this module (e.g. localhost:3000/shop) [cite: 11]
    [cite_start]router: router [cite: 11]
[cite_start]}; [cite: 11]
```

## 4. EJS Views & Rendering in Modules
[cite_start]The engine uses `EJS` as the template engine[cite: 12]. [cite_start]Because modules are isolated, they must not rely on a global `/views` folder[cite: 13]. 
* [cite_start]Each module brings its own EJS files in a local subfolder (e.g., `/modules/shop/views/`)[cite: 14].
* [cite_start]When rendering, the absolute path to the local EJS file MUST be passed[cite: 15]:

```javascript
[cite_start]const viewsPath = path.join(__dirname, 'views'); [cite: 15]

[cite_start]router.get('/items', (req, res) => { [cite: 16]
    [cite_start]// Renders the file /modules/shop/views/items.ejs [cite: 16]
    [cite_start]res.render(path.join(viewsPath, 'items.ejs'), {  [cite: 16]
        [cite_start]data: "Some Data", [cite: 16]
        [cite_start]user: req.session ? req.session.user : null  [cite: 16]
    [cite_start]}); [cite: 16]
[cite_start]}); [cite: 16]
```

## 5. Global Tools & Dependencies

### Logging (`core/Logger.js`)
[cite_start]Always use the global Logger instead of `console.log`[cite: 17].
* [cite_start]Available methods: `Logger.info`, `Logger.warn`, `Logger.error`, `Logger.success`[cite: 18].

### Sessions & Authentication
[cite_start]The engine uses `express-session`[cite: 19]. [cite_start]The `auth` module writes the logged-in user into `req.session.user`[cite: 19]. 
* [cite_start]If a route needs to be protected, write a small local middleware[cite: 20]:

```javascript
[cite_start]function requireLogin(req, res, next) { [cite: 20]
    [cite_start]if (req.session && req.session.user) return next(); [cite: 20]
    [cite_start]res.redirect('/login'); [cite: 21]
[cite_start]} [cite: 21]

[cite_start]router.get('/secret', requireLogin, (req, res) => { [cite: 21]
    [cite_start]res.send("Hello " + req.session.user.username); [cite: 21]
[cite_start]}); [cite: 21]
```

### Reading/Writing Global Data (e.g., users.json, stats.json)
[cite_start]If a module needs to access configuration files in the root directory, the path MUST be resolved relative to the module's router[cite: 22].

```javascript
[cite_start]const fs = require('fs'); [cite: 23]
[cite_start]const path = require('path'); [cite: 23]

[cite_start]// Goes from /modules/shop/router.js back to the root directory [cite: 23]
[cite_start]const statsPath = path.join(__dirname, '../../stats.json'); [cite: 23]
[cite_start]const globalStats = JSON.parse(fs.readFileSync(statsPath, 'utf8')); [cite: 24]
```

## 6. Summary for AI Agents
When you receive the task to add a feature to this site:
1.  [cite_start]DO NOT touch `core/WebServer.js` or `index.js`[cite: 24].
2.  [cite_start]Create an isolated folder in `/modules/`[cite: 25].
3.  [cite_start]Create the `router.js` there, export `prefix` and `router`[cite: 25].
4.  [cite_start]Place module-specific HTML/EJS files in `/modules/YourModule/views/`[cite: 26].
5.  [cite_start]Use `res.render(path.join(__dirname, 'views', 'file.ejs'))`[cite: 26].
6.  [cite_start]Reference static images via `/assets/...` (these are located in `/public/assets`)[cite: 27].