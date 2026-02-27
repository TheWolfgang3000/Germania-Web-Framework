# GERMANIA WEB FRAMEWORK

Modular, Express.js-based web framework designed for isolated module development.

## Key Features

* **Automatic Module Loading:** The core `WebModuleLoader` automatically scans the `/modules/` directory on startup and dynamically mounts all found routes.
* **Feature Isolation:** Every feature of ze website (e.g., Auth, Wiki) lives in its own folder with its specific `router.js` and local EJS `views`.
* **Lightweight Core:** The base engine only handles HTTP routing and middleware initialization, keeping the system fast and preventing code that makes you wanna kys.

**Install Dependencies:**
   ```bash
   npm install
   ```
**Run ze Framework:**
   ```
   node index.js
   ```
The framework runs locally on port `3000` (or your defined `PORT`). Open `http://localhost:3000` in your browser.

## Creating a New Module

To add a new feature to the framework, simply create a new folder inside `/modules/` with a `router.js` file exporting your route and prefix:

```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello from the new module!");
});

module.exports = {
    prefix: '/my-module',
    router: router
};
```
*No core files need to be modified. The framework will detect and load this module automatically upon the next restart.*

---
**Note:** For more information on how to use EJS views within modules or access global data, please refer to the official Framework Documentation.
