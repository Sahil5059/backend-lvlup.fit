//4(a).setting-up-error-handling
class ErrorHandler extends Error {
    statusCode: Number;
    constructor(message:any, statusCode:Number){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default ErrorHandler;
//now, move to the "error.ts" file in the "middleware" folder