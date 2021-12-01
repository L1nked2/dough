import express from "express";
import axios from "axios";
import QueryString from "qs";
const router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
    res.status(403).send('Forbidden');
});

export default router;