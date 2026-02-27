// core/WebServer.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const Logger = require('./Logger');
const WebModuleLoader = require('./WebModuleLoader');

const app = express();
// Uses Port 3000 for local Testing
const PORT = process.env.PORT || 3000; 

module.exports = {
    start: async () => {
        Logger.info('SERVER', 'Initialize Express Middleware...');
        
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.set('view engine', 'ejs');
        
        app.use(session({
            secret: 'germania-core-secret',
            resave: false,
            saveUninitialized: false
        }));

        app.use(express.static(path.join(__dirname, '../public')));

        await WebModuleLoader(app);

        app.use((req, res) => {
            Logger.warn('SERVER', `404 Blocked - No Route found: ${req.url}`);
            res.status(404).send('System Error 404: Module not loaded or Page not found.');
        });

        const server = app.listen(PORT, () => {
            Logger.success('SERVER', `Web-Framework running. http://localhost:${PORT}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EACCES') {
                Logger.error('SERVER', `No Permission for Port: ${PORT}. Please start as Admin.`);
            } else if (err.code === 'EADDRINUSE') {
                Logger.error('SERVER', `Port ${PORT} is already used by another Program!`);
            } else {
                Logger.error('SERVER', `Server-Error: ${err.message}`);
            }
        });
    }
};