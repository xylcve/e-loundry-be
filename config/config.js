const fs = require('fs');
const path = require("path");

const SECRET_KEY = fs.readFileSync(path.join(__dirname, '..', 'certs', 'private.key'), { encoding: 'utf-8' });
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '..', 'certs', 'public.key'), { encoding: 'utf-8' });

module.exports = { SECRET_KEY, PUBLIC_KEY }