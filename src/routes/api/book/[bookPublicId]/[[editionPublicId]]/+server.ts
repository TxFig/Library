import api, { ApiMethodResponse } from "$lib/server/api"
import { BaseEndpoint, FormEndpoint } from "$lib/server/api/endpoint"
import { BookCreateSchema } from "$lib/validation/book/book"
import { PublicIdSchema } from "$lib/validation/book/publicId"
import type { RequestEvent } from "./$types"


const PublicIdParamSchema = {
    schema: PublicIdSchema,
    onError: () => ApiMethodResponse({
        success: false,
        code: 400,
        message: "Invalid Public ID"
    })
}

export const GET = BaseEndpoint<RequestEvent>(api.book.bookPublicId.GET, {
    auth: ["View Book"],
    params: {
        bookPublicId: PublicIdParamSchema
    }
})

export const PATCH = FormEndpoint<RequestEvent, BookCreateSchema>(api.book.bookPublicId.PATCH, BookCreateSchema, {
    auth: ["Edit Book"],
    params: {
        bookPublicId: PublicIdParamSchema
    }
})

export const DELETE = BaseEndpoint<RequestEvent>(api.book.bookPublicId.DELETE, {
    auth: ["Delete Book"],
    params: {
        bookPublicId: PublicIdParamSchema
    }
})
