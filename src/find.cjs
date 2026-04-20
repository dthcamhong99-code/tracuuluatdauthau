const fs = require('fs');
const path = require('path');

function findDir(dir, targetName) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            try {
                if (fs.statSync(fullPath).isDirectory()) {
                    if (file === targetName) {
                        console.log('Found:', fullPath);
                    } else {
                        findDir(fullPath, targetName);
                    }
                }
            } catch (e) {}
        }
    } catch(e) {}
}

console.log("Searching for '.gemini'...");
findDir('/', '.gemini');
console.log("Done.");
