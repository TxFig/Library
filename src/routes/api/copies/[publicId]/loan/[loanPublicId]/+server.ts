import authValidator from "$lib/request-validators/auth";
import schemaValidator, { getFormDataOrJson } from "$lib/request-validators/data-schema";
import paramsValidator from "$lib/request-validators/params";
import { ApiError, handleApiErrorWrapper } from "$lib/server/api/error";
import { PublicIdParamSchema } from "$lib/server/api/paramSchemas";
import type { RequestHandler } from "./$types";
import HttpCodes from "$lib/utils/http-codes";
import api, { ApiMethodResponse } from "$lib/server/api";
import { CopyLoanUpdateSchema, CopyRequestCreateSchema } from "$lib/validation/interactions/copy";
import type * as v from "valibot"


export const PATCH: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    })
    paramsValidator(event, {
        publicId: PublicIdParamSchema,
        loanPublicId: PublicIdParamSchema
    })

    const data = await getFormDataOrJson<v.InferInput<CopyLoanUpdateSchema>>(event)
    if (!data) {
        throw new ApiError(HttpCodes.ClientError.BadRequest, "No Data Provided")
    }

    const form = await schemaValidator(data, CopyLoanUpdateSchema)
    const result = await api.copies.loan.PATCH(
        event.params.publicId,
        event.params.loanPublicId,
        form.data,
        event.locals
    )

    return ApiMethodResponse(result)
})
