const express = require('express');
const router = require('./router/router');
const { PORT } = require('./config/config');

const app = express();

app.use(express.json());

app.use('/', router);

app.listen(PORT, () => {console.log(`Server listening on ${PORT}`)});