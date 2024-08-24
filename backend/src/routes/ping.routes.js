const router = require('express').Router();
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiErrors } = require("../utils/ApiErrors");
const ping = require('ping');
router.route("/:host").get(async(req, res) => {
    try {
        const host = req.params.host;
        const result = await ping.promise.probe(host);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode, error.data, error.message, error));
    }
})
module.exports = router;