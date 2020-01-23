const express = require("express");
const bodyParser = require("body-parser");
// data
const allProjects = require("./data/projects");
const allOrganizations = require("./data/organizations");
const accounts = require("./data/userAccounts")
// cors
const cors = require("cors");

// initalize app
const app = express();

//app.use(cors())
app.options('*', cors())

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

app.get("/projects/:id", cors(corsOptions), (req, res) => {
    res.send(allProjects);
});

app.get("/project/:contentId/:projectId", cors(corsOptions), (req, res) => {

    let organization;
    allProjects.map(org => {
        if (req.params.contentId.toString() === org.organizationId.toString()) {
            organization = {
                ...org
            };
        }
    })

    const projects = organization.projects
    let currentProject;
    //console.log(projects)

    projects && projects.map(project => {
        if (req.params.projectId.toString() === project.id.toString()) {
            currentProject = {
                ...project
            }
        }
    })

    delete organization.projects
    organization.project = currentProject

    res.send(organization);
});

app.get("/organizations", cors(corsOptions), (req, res, next) => {
    res.send(allOrganizations);
});

// Sign in
app.get("/auth", cors(corsOptions), (req, res, next) => {
    const account = accounts.find(x => x.name.toLocaleLowerCase() === req.headers.username.toLowerCase())
    // validate login 
    if (!account)
        return res.sendStatus(404); // not found 
    if (account.password.toString() === req.headers.token.toString()) {
        let thisAccount = {
            id: account.id,
            name: account.name,
        }
        return res.send(thisAccount);
    } else
        return res.sendStatus(401) // bad request    
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