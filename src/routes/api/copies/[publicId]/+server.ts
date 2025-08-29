import authValidator from "$lib/request-validators/auth";
import paramsValidator from "$lib/request-validators/params";
import { ApiError, handleApiErrorWrapper } from "$lib/server/api/error";
import { PublicIdParamSchema } from "$lib/server/api/paramSchemas";
import type { RequestHandler } from "./$types";
import api, { ApiMethodResponse } from "$lib/server/api";
import { CopyUpdateSchema } from "$lib/validation/interactions/copy";
import { getFormDataOrJson } from "$lib/request-validators/data-schema";
import schemaValidator from "$lib/request-validators/data-schema";
import HttpCodes from "$lib/utils/http-codes"
import type * as v from "valibot"

export const PATCH: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    })
    paramsValidator(event, {
        publicId: PublicIdParamSchema,
    })

    const data = await getFormDataOrJson<v.InferInput<CopyUpdateSchema>>(event)
    if (!data) {
        throw new ApiError(HttpCodes.ClientError.BadRequest, "No Data Provided")
    }

    const form = await schemaValidator(data, CopyUpdateSchema)

    const result = await api.copies.PATCH(
        event.params.publicId,
        form.data,
        event.locals
    )

    return ApiMethodResponse(result)
})
