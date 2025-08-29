import type { RequestHandler } from "./$types";

import authValidator from "$lib/request-validators/auth";
import { ApiError, handleApiErrorWrapper } from "$lib/server/api/error";
import schemaValidator, { getFormDataOrJson } from "$lib/request-validators/data-schema";
import { BookSchema } from "$lib/validation/book";
import api, { ApiMethodResponse } from "$lib/server/api";
import type { InferIn } from "sveltekit-superforms";
import HttpCodes from "$lib/utils/http-codes";


export const GET: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    })
    const result = await api.books.GET()

    return ApiMethodResponse(result)
})

export const POST: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    }, ["Create Book"])

    const data = await getFormDataOrJson<InferIn<BookSchema>>(event)
    if (!data) {
        throw new ApiError(HttpCodes.ClientError.BadRequest, "No Data Provided")
    }
    const form = await schemaValidator(data, BookSchema)
    const result = await api.books.POST(form.data, event.locals)
    return ApiMethodResponse(result)
})
