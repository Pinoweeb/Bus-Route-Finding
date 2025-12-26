const express = require('express');
const db = require('./config/db');
const routesRouter = require('./routes/routes.routes');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/routes', routesRouter);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
