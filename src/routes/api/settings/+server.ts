import { SettingsUpdateSchema } from "$lib/validation/auth/settings"
import { error, json } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import db from "$lib/server/database/"
import type { RequestHandler } from "./$types"


export const PATCH: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const data = await request.json()
    const parsingResult = SettingsUpdateSchema.safeParse(data)

    if (!parsingResult.success) {
        error(HttpCodes.ClientError.BadRequest, {
            message: "Invalid Request"
        })
    }

    const parsedData = parsingResult.data

    try {
        await db.auth.settings.updateUserSettings(locals.user.id, parsedData)
        return json({
            status: HttpCodes.Success,
            message: "Successfully Updated Settings"
        })
    } catch (error) {
        return json({
            status: HttpCodes.ServerError.InternalServerError,
            message: "Error Updating Settings"
        })
    }
}
