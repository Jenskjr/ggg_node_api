const express = require("express");
const bodyParser = require("body-parser");
const allContent = require("./data/all");
const cors = require("cors");

// initalize app
const app = express();

// cors policy---------------------------------------------------
var whitelist = ["http://jenskjr.dk", "http://localhost:3000"];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
};

// configure the app to use bodyParser() ------------------
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

// Hello world -------------------------------------------
app.get("/", (req, res) => {
    res.send("Hello World!!!");
});

// get routes ------------------------------------------------
app.get("/all", cors(corsOptions), (req, res) => {
    res.send(allContent);
});

app.get("/organizations", cors(corsOptions), (req, res, next) => {
    res.send("These are all organizations!");
});

app.get("/projects/:id", (req, res) => {
    res.send("These are all projects!");
});

app.get("/project/:id", (req, res) => {
    res.send("This is a single project!");
});

app.set("port", process.env.PORT || 8081);

app.listen(app.get("port"), () => {
    console.log("Server is up and running on port: " + app.get("port"));
});