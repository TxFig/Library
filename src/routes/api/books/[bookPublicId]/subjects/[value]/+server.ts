import authValidator from "$lib/request-validators/auth";
import paramsValidator from "$lib/request-validators/params";
import { ApiError } from "$lib/server/api/error";
import { handleApiErrorWrapper } from "$lib/server/api/error";
import { PublicIdParamSchema } from "$lib/server/api/paramSchemas";
import type { RequestHandler } from "./$types";
import HttpCodes from "$lib/utils/http-codes";
import api, { ApiMethodResponse } from "$lib/server/api";
import { SubjectSchema } from "$lib/validation/book/subject";



export const DELETE: RequestHandler = handleApiErrorWrapper(async (event) => {
    authValidator(event, (status, message) => {
        throw new ApiError(status, message)
    }, ["Edit Book"])
    paramsValidator(event, {
        bookPublicId: PublicIdParamSchema,
        value: {
            schema: SubjectSchema,
            onInvalid() {
                throw new ApiError(
                    HttpCodes.ClientError.BadRequest,
                    "Invalid Subject Value"
                )
            },
        }
    })

    const result = await api.books.bookPublicId.subjects.value.DELETE(
        event.params.bookPublicId,
        event.params.value,
        event.locals
    )
    return ApiMethodResponse(result)
})
