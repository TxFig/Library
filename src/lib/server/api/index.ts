import { HttpCodes, type HttpErrorCodesValues, type HttpSuccessValues } from "$lib/utils/http-codes"
import { json } from "@sveltejs/kit"


export type ApiMethodReturn<Data = any, Errors = any> = {
    success: true,
    code?: HttpSuccessValues,
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
            status: HttpCodes["Success"]["OK"]
        }
    : MethodReturn extends { success: false } ?
        {
            message: MethodReturn["message"]
            status: MethodReturn["code"]
            errors: MethodReturn["errors"]
        }
    : never

export function ApiMethodResponse(methodReturn: ApiMethodReturn): Response {
    if (methodReturn.success) {
        return json(
            {
                data: methodReturn.data,
                status: methodReturn.code ?? HttpCodes.Success.OK
            },
            {
                status: methodReturn.code ?? HttpCodes.Success.OK
            }
        )
    } else {
        return json({
            message: methodReturn.message,
            errors: methodReturn.errors,
            status: methodReturn.code
        }, {
            status: methodReturn.code
        })
    }
}


import books from "./books"
import user from "./user"
import settings from "./settings"
import bookCollection from "./book-collection"
import editions from "./editions"
import copies from "./copies"


export default {
    books,
    user,
    settings,
    bookCollection,
    editions,
    copies
}
