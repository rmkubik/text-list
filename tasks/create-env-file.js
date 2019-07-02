const fs = require('fs');

const entries = Object.entries(process.env);
const array = entries.map(([key, value]) => `${key}=${value}`);
const env = array.join('\n');

fs.writeFile('./env.production', env, console.log);
