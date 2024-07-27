import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import HttpCodes from "$lib/utils/http-codes"
import { ReadingStateUpdateSchema } from "$lib/validation/book/reading-state"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import api, { defaultApiMethodResponse } from "$lib/server/api"


export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["Edit Book"])],
    async ({ request, locals }) => {
        const userId = locals.user!.id
        const data = await request.json()
        const parsingResult = ReadingStateUpdateSchema.safeParse(data)

        if (!parsingResult.success) {
            return json({
                status: HttpCodes.ClientError.BadRequest,
                message: "Invalid Request"
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.readingState.PATCH(parsingResult.data, userId)
        )
    }
)
