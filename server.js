const express = require('express');
const router = require('./src/routes/fileRoutes');
const { PORT } = require('./src/config/config');

const app = express();

app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {console.log(`Server listening on ${PORT}`)});