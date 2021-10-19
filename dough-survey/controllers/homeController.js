function sendReqParam(req, res) {
    let veg = req.params.vegetable;
    res.send(`This is the page for ${veg}`);
}

function resWithName(req, res) {
    let paramsName = req.params.myName;
    res.render("index.ejs", {name: paramsName});
}

export {sendReqParam, resWithName};