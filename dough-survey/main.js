// Initalize requirements
//import expressEjsLayouts from "express-ejs-layouts";
import * as errorController from "./controllers/errorController.js";
import * as homeController from "./controllers/homeController.js";
import express from "express";
import routes from "./routes/index.js";

const app = express();
app.use(
    express.urlencoded({
        extended: false
    })
);

// ===========================
const port = 3000;
app.use(express.json());
app.use("/", routes);

//app.use(expressEjsLayouts); delete pkg if not using layouts
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/items/:vegetable", homeController.sendReqParam);

app.get("/name/:myName", homeController.resWithName);

app.post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("post successful")
})

app.listen( port, () => {
    console.log(`express server is listening on port ${port}`);
});

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);