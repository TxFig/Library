import { HttpCodes, type HttpErrorCodesValues } from "$lib/utils/http-codes"
import { json } from "@sveltejs/kit"


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

import { PublicIdSchema } from "$lib/validation/book/publicId"
import { BookCreateSchema } from "$lib/validation/book/book"

export const apiEndpoints = {
    book: {
        GET: { publicId: PublicIdSchema },
        POST: { schema: BookCreateSchema },
        PATCH: { schema: BookCreateSchema },
        PUT: { schema: BookCreateSchema },
        DELETE: { publicId: PublicIdSchema },

    }
} as const
