class ApiResponse{
    constructor(
        statusCode,
        data,
        message = "Success",
        error = null
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode >= 200 && statusCode < 300;
        this.error = error;
    }
}

module.exports = {ApiResponse};