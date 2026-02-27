// core/WebModuleLoader.js
const fs = require('fs');
const path = require('path');
const Logger = require('./Logger');

module.exports = async (app) => {
    const modulesPath = path.join(__dirname, '../modules');
    
    if (!fs.existsSync(modulesPath)) {
        fs.mkdirSync(modulesPath);
        Logger.warn('WEB-LOADER', 'Modules Folder wasnt there. I have created it now.');
        return;
    }

    const moduleFolders = fs.readdirSync(modulesPath);
    Logger.info('WEB-LOADER', `Starting to load ${moduleFolders.length} Web-Modules...`);

    for (const folder of moduleFolders) {
        const moduleDir = path.join(modulesPath, folder);
        if (!fs.lstatSync(moduleDir).isDirectory()) continue;

        Logger.debug('WEB-LOADER', `Scanning Module: ${folder}...`);

        try {
            const routerPath = path.join(moduleDir, 'router.js');
            if (fs.existsSync(routerPath)) {
                const moduleRouter = require(routerPath);
                const prefix = moduleRouter.prefix || '/';
                
                app.use(prefix, moduleRouter.router);
                Logger.success('WEB-LOADER', `Module Activated: ${folder} (Route: ${prefix})`);
            } else {
                Logger.warn('WEB-LOADER', `Module ${folder} does not have router.js`);
            }
        } catch (error) {
            Logger.error('WEB-LOADER', `Error loading the Module ${folder}: ${error.message}`);
        }
    }
};