import authValidator from "$lib/request-validators/auth";
import paramsValidator from "$lib/request-validators/params";
import api, { ApiMethodResponse } from "$lib/server/api";
import { ApiError } from "$lib/server/api/error";
import { handleApiErrorWrapper } from "$lib/server/api/error";
import { PublicIdParamSchema } from "$lib/server/api/paramSchemas";
import type { RequestHandler } from "./$types";


export const DELETE: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    }, ["Delete Book"])
    paramsValidator(event, {
        bookPublicId: PublicIdParamSchema
    })

    const result = await api.books.bookPublicId.DELETE(event.params.bookPublicId, event.locals)
    return ApiMethodResponse(result)
})
