const expressEjsLayouts = require("express-ejs-layouts");
const errorController = require("./controllers/errorController");
const homeController = require("./controllers/homeController");

const port = 3000,
    express = require("express"),
    app = express();

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.use(expressEjsLayouts);

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.send("hello, 123");
});