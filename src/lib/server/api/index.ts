import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import { error, json } from "@sveltejs/kit"


export type ApiMethodReturn<Data = any, Errors = any> = {
    success: true,
    message?: string,
    data: Data
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string,
    errors?: Errors
}

export type ApiJsonResponse<MethodReturn extends ApiMethodReturn> =
    MethodReturn extends { success: true } ?
        {
            data: MethodReturn["data"],
            status: HttpCodes["Success"]
        }
    : MethodReturn extends { success: false } ?
        {
            message: MethodReturn["message"]
            status: MethodReturn["code"]
            errors: MethodReturn["errors"]
        }
    : never

export function ApiMethodResponse<Data = any>(methodReturn: ApiMethodReturn<Data>): Response {
    if (methodReturn.success) {
        return json({
            data: methodReturn.data,
            status: HttpCodes.Success
        }, {
            status: HttpCodes.Success
        })
    } else {
        return json({
            message: methodReturn.message,
            status: methodReturn.code,
            errors: methodReturn.errors
        }, {
            status: methodReturn.code
        })
    }
}

export class ApiError extends Error {
    code: HttpErrorCodesValues

    constructor(code: HttpErrorCodesValues, message: string) {
        super(message)
        this.code = code
    }
}

export function handleApiError(err: unknown): Response {
    if (!(err instanceof ApiError)) {
        error(HttpCodes.ServerError.InternalServerError, {
            message: "Something went wrong",
            error: err
        })
    }

    return ApiMethodResponse({
        success: false,
        message: err.message,
        code: err.code
    })
}

import book from "./book"
import user from "./user"
import readingState from "./reading-state"
import settings from "./settings"
import bookCollection from "./book-collection"
import rating from "./rating"

export default {
    book,
    user,
    readingState,
    settings,
    bookCollection,
    rating
}
