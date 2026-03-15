export class UeException {
    constructor(
        public message: string,
        public errors: any
    ) {
        this.message = message;
        this.errors = errors;
    }
}