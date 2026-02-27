// index.js
const WebServer = require('./core/WebServer');
const Logger = require('./core/Logger');

process.on('uncaughtException', (err) => {
    Logger.error('SYSTEM', `Critical Error: ${err.message}`);
});

Logger.info('SYSTEM', 'Starting Germania Web Framework...');
WebServer.start();