class HttpException {
    constructor(public status: number, public message: string, public errors?: any) {

    }
}

class UnauthorizedException extends HttpException {
    constructor() {
        super(401, 'Unauthorized', );
    }
}
class InvalidFormException extends HttpException {
    constructor(errors: any) {
        super(422, 'Invalid form', errors);
    }
}

export {
    HttpException,
    UnauthorizedException,
    InvalidFormException
}