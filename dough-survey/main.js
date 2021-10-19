// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTuC8MUuBtZtCnP9YJh8BgRuUJMS687Jw",
  authDomain: "dough-survey.firebaseapp.com",
  projectId: "dough-survey",
  storageBucket: "dough-survey.appspot.com",
  messagingSenderId: "111678578513",
  appId: "1:111678578513:web:32f35f3eb65cfb2f19bd70",
  databaseURL: "https://dough-survey-default-rtdb.asia-southeast1.firebasedatabase.app/",
  measurementId: "G-VS98EGYRJL"
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
const database = getDatabase(fireBaseApp);
//const analytics = getAnalytics(fireBaseApp);

// Initalize requirements
const port = 3000;
//import expressEjsLayouts from "express-ejs-layouts";
import * as errorController from "./controllers/errorController.js";
import * as homeController from "./controllers/homeController.js";
import express from "express";

const app = express();
app.use(
    express.urlencoded({
        extended: false
    })
);
// ===========================
app.use(express.json());
//app.use(expressEjsLayouts);
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