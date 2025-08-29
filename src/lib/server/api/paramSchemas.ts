import { ApiError } from "$lib/server/api/error"
import HttpCodes from "$lib/utils/http-codes"
import { PublicIdSchema } from "$lib/validation/publicId"


export const PublicIdParamSchema = {
    schema: PublicIdSchema,
    onInvalid: () => {
        throw new ApiError(
            HttpCodes.ClientError.BadRequest,
            "Invalid Public ID"
        )
    }
}
