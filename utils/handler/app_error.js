export class BaseAppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends BaseAppError {
    constructor(message = "Invalid data"){
        super(message, 400);
    }
}

export class AuthError extends BaseAppError{
    constructor(message = "Unauthorized Access"){
        super(message, 401)
    }
}

export class NotFoundError extends BaseAppError{
    constructor(message = "Source not found"){
        super(message, 404)
    }
}