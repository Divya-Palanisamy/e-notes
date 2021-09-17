const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./backend/app')

const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(( ) => console.log("Connect to Database successfully!"))
.catch(err => console.log("Unable to connect to database"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("App is running");
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION1');
    console.log(err.name, err.message) ;
    process.exit(1);
});