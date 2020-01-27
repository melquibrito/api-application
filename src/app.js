const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/database");
const config = require("./config/config");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = config.development.database.host;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api', require('../src/routes/routes'));

app.set("port", PORT);
app.listen(PORT, console.log(`Server running on http://${HOST}:${PORT}/api/visited`));

start();

async function start() {
    await connect();
}

async function connect() {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (e) {
        console.error(`Error: ${e}`);
    }
}