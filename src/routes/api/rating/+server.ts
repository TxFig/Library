import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import HttpCodes from "$lib/utils/http-codes"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import api, { defaultApiMethodResponse } from "$lib/server/api"
import { RatingUpdateSchema } from "$lib/validation/book/rating"


export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],
    async ({ request, locals }) => {
        const userId = locals.user!.id
        const data = await request.json()
        const parsingResult = RatingUpdateSchema.safeParse(data)

        if (!parsingResult.success) {
            return json({
                status: HttpCodes.ClientError.BadRequest,
                message: "Invalid Request"
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.rating.PATCH(parsingResult.data, userId)
        )
    }
)
