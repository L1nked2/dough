import express from "express";
import axios from "axios";
import QueryString from "qs";
const router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
    res.render('login_kakao.ejs');
});

export default router;