# GERMANIA WEB FRAMEWORK - Module Creation Guide

[cite_start]This guide shows you step-by-step how to integrate a new feature module into the framework. [cite: 1]

## Step 1: Create Directory Structure
1. [cite_start]Go to the `/modules/` folder. [cite: 3]
2. [cite_start]Create a new folder for your feature there (e.g., `/modules/my_module/`). [cite: 7]
3. [cite_start]Inside this folder, you MUST create a file named `router.js`. [cite: 8]
4. [cite_start]If your module needs to display its own HTML/EJS pages, additionally create the `/modules/my_module/views/` folder. [cite: 14]

## Step 2: Configure `router.js`
[cite_start]Each module requires an Express router and a defined URL prefix. [cite: 9] [cite_start]The export must look exactly like this: [cite: 11]

```javascript
const express = require('express');
const path = require('path');
const Logger = require('../../core/Logger'); // Recommended for clean logs

const router = express.Router();

// Base route: Accessible at localhost:3000/my_module/
router.get('/', (req, res) => {
    res.send("Module is running!");
});

// STRICTLY REQUIRED EXPORT FORMAT
module.exports = {
    [cite_start]prefix: '/my_module', // Base URL of the module [cite: 11]
    router: router
};
```

## Step 3: Render Frontend Views (EJS)
[cite_start]Since modules are isolated, you must always provide the absolute path to your local `views` folder when rendering: [cite: 13, 15]

```javascript
const viewsPath = path.join(__dirname, 'views'); 

router.get('/page', (req, res) => {
    [cite_start]// Renders the file /modules/my_module/views/index.ejs [cite: 16]
    res.render(path.join(viewsPath, 'index.ejs'), {
        user: req.session ? req.session.user : null
    });
});
```

## Step 4: Best Practices
* **Images & CSS:** Use the global `/public/` folder. [cite_start]Link images in your EJS files simply with `/assets/imagename.png`. [cite: 27]
* **Logging:** Never use `console.log`. [cite_start]Import the core logger and use `Logger.info()`, `Logger.warn()`, etc. [cite: 18]
* [cite_start]**Global Data:** If you want to read `stats.json` for example, navigate two levels back from `router.js`: `path.join(__dirname, '../../stats.json')`. [cite: 23, 24]