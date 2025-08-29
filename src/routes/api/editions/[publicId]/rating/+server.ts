import authValidator from "$lib/request-validators/auth";
import schemaValidator, { getFormDataOrJson } from "$lib/request-validators/data-schema";
import paramsValidator from "$lib/request-validators/params";
import { ApiError, handleApiErrorWrapper } from "$lib/server/api/error";
import { RatingUpdateSchema } from "$lib/validation/book/rating";
import type { InferIn } from "sveltekit-superforms";
import { PublicIdParamSchema } from "$lib/server/api/paramSchemas";
import type { RequestHandler } from "./$types";
import HttpCodes from "$lib/utils/http-codes";
import api, { ApiMethodResponse } from "$lib/server/api";


export const PATCH: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    })
    paramsValidator(event, {
        publicId: PublicIdParamSchema
    })

    const data = await getFormDataOrJson<InferIn<RatingUpdateSchema>>(event)
    if (!data) {
        throw new ApiError(HttpCodes.ClientError.BadRequest, "No Data Provided")
    }
    const form = await schemaValidator(data, RatingUpdateSchema)
    const result = await api.editions.publicId.rating.PATCH(event.params.publicId, form.data, event.locals)

    return ApiMethodResponse(result)
})
