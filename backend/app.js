const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});
const bodyParser = require('body-parser');

const noteRouter = require('./routes/noteRoutes');
const authRouter = require('./routes/auth');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });
  

app.use('/api/notes', noteRouter);
app.use('/api/user', authRouter);


module.exports = app;