const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Profit Map!');
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});