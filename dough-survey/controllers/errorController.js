import { StatusCodes } from "http-status-codes";

function respondNoResourceFound(req, res) {
    let errorCode = StatusCodes.NOT_FOUND;
    res.status(errorCode);
    res.sendFile(`./views/partials/error.gif`, {
        root: "./"
    });
};
function respondInternalError(errors, req, res, next) {
    let errorCode = StatusCodes.INTERNAL_SERVER_ERROR;
    console.log(`Error occurred: ${errors.stack}`);
    res.status(errorCode);
    res.send(`${errorCode} | Internal error`);
};

export {respondNoResourceFound, respondInternalError};