import type { HttpCodesValues } from "./http-codes"


export class HttpError {
    message: any
    httpCode: HttpCodesValues

    constructor(httpCode: HttpCodesValues, message?: any) {
        this.message = typeof message == "string" ? { message } : message
        this.httpCode = httpCode
    }
}
