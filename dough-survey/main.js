// Initalize requirements
//import expressEjsLayouts from "express-ejs-layouts";
import * as errorController from "./controllers/errorController.js";
import * as homeController from "./controllers/homeController.js";
import express from "express";
import routes from "./routes/routes.js";

const app = express();
app.use(
    express.urlencoded({
        extended: false
    })
);

// ===========================
const port = 3000;
app.use(express.json());
app.set('view engine', 'ejs');
app.use("/", routes);
app.use(express.static('public'));
//app.use(expressEjsLayouts); delete pkg if not using layouts


app.listen( port, () => {
    console.log(`express server is listening on port ${port}`);
});

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);