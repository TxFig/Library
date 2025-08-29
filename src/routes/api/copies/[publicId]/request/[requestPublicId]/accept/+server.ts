import authValidator from "$lib/request-validators/auth";
import paramsValidator from "$lib/request-validators/params";
import { ApiError, handleApiErrorWrapper } from "$lib/server/api/error";
import { PublicIdParamSchema } from "$lib/server/api/paramSchemas";
import type { RequestHandler } from "./$types";
import api, { ApiMethodResponse } from "$lib/server/api";


export const POST: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    })
    paramsValidator(event, {
        publicId: PublicIdParamSchema,
        requestPublicId: PublicIdParamSchema
    })

    const result = await api.copies.request.accept.POST(
        event.params.publicId,
        event.params.requestPublicId,
        event.locals
    )

    return ApiMethodResponse(result)
})
