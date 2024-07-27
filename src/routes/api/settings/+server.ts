import { SettingsUpdateSchema } from "$lib/validation/auth/settings"
import { json } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import type { RequestHandler } from "./$types"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import api, { defaultApiMethodResponse } from "$lib/server/api"


export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["View Book"])],
    async ({ request, locals }) => {
        const userId = locals.user!.id
        const data = await request.json()
        const parsingResult = SettingsUpdateSchema.safeParse(data)

        if (!parsingResult.success) {
            return json({
                status: HttpCodes.ClientError.BadRequest,
                message: "Invalid Request"
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        return defaultApiMethodResponse(
            await api.settings.PATCH(parsingResult.data, userId)
        )
    }
)
