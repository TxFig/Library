import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import { json } from "@sveltejs/kit"


export type InternalApiMethodReturn = {
    success: true,
    message?: string,
    data: any
} | {
    success: false,
    code: HttpErrorCodesValues,
    message: string,
}

export type ApiJsonResponse<InternalMethodReturn extends InternalApiMethodReturn> =
    InternalMethodReturn extends { success: true } ?
        {
            data: InternalMethodReturn["data"],
            status: HttpCodes["Success"]
        }
    : InternalMethodReturn extends { success: false } ?
        {
            message: InternalMethodReturn["message"]
            status: InternalMethodReturn["code"]
        }
    : never

export function defaultApiMethodResponse(methodReturn: InternalApiMethodReturn): Response {
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
            status: methodReturn.code
        }, {
            status: methodReturn.code
        })
    }
}


import book from "./book"
import user from "./user"
import readingState from "./reading-state"
import settings from "./settings"
import bookCollection from "./book-collection"

export default {
    book,
    user,
    readingState,
    settings,
    bookCollection
}
