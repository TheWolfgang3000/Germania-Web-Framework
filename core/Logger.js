// core/Logger.js
function timestamp() {
    return new Date().toLocaleTimeString('de-DE', { hour12: false });
}

module.exports = {
    info: (source, msg) => console.log(`[${timestamp()}] [INFO] [${source}] ${msg}`),
    warn: (source, msg) => console.log(`\x1b[33m[${timestamp()}] [WARN] [${source}] ${msg}\x1b[0m`),
    error: (source, msg) => console.error(`\x1b[31m[${timestamp()}] [ERROR] [${source}] ${msg}\x1b[0m`),
    debug: (source, msg) => console.log(`\x1b[90m[${timestamp()}] [DEBUG] [${source}] ${msg}\x1b[0m`),
    success: (source, msg) => console.log(`\x1b[32m[${timestamp()}] [SUCCESS] [${source}] ${msg}\x1b[0m`)
};