import type { HttpErrorCodesValues } from "./http-codes"


export class HttpError {
    message: any
    httpCode: HttpErrorCodesValues

    constructor(httpCode: HttpErrorCodesValues, message?: any) {
        this.message = typeof message == "string" ? { message } : message
        this.httpCode = httpCode
    }
}
