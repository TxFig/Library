import type { HttpErrorCodes } from "./http-codes"


export class HttpError {
    message: any
    httpCode: HttpErrorCodes

    constructor(httpCode: HttpErrorCodes, message?: any) {
        this.message = typeof message == "string" ? { message } : message
        this.httpCode = httpCode
    }
}
