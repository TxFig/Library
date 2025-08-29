import authValidator from "$lib/request-validators/auth";
import schemaValidator, { getFormDataOrJson } from "$lib/request-validators/data-schema";
import paramsValidator from "$lib/request-validators/params";
import api, { ApiMethodResponse } from "$lib/server/api";
import { ApiError, handleApiErrorWrapper } from "$lib/server/api/error";
import HttpCodes from "$lib/utils/http-codes";
import { BookEditionSchema } from "$lib/validation/book";
import type { InferIn } from "sveltekit-superforms";
import { PublicIdParamSchema } from "$lib/server/api/paramSchemas";
import type { RequestHandler } from "./$types";


export const POST: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    }, ["Create Book"])
    paramsValidator(event, {
        bookPublicId: PublicIdParamSchema
    })

    const data = await getFormDataOrJson<InferIn<BookEditionSchema>>(event)
    if (!data) {
        throw new ApiError(HttpCodes.ClientError.BadRequest, "No Data Provided")
    }
    const form = await schemaValidator(data, BookEditionSchema)
    const result = await api.books.bookPublicId.editions.POST(event.params.bookPublicId, form.data, event.locals)
    return ApiMethodResponse(result)
})
