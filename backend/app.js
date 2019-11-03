const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;
const host = 'localhost';

app.get('/start', (req, res, next) => {
    res.send('It\'s working!');
});

app.listen(port, host, () => {
    console.log(`Server is running on port: ${port}, and hostname: ${host}`);
});
