const dotenv = require('dotenv');
const process = require('process');

dotenv.config();

const FILES_DIR = process.env.FILES_DIR || "static";
const PORT = process.env.PORT || 8080;

module.exports = { FILES_DIR, PORT };