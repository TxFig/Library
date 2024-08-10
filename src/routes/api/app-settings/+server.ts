import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";
import { AppSettingsSchema } from "$lib/validation/app-settings";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import HttpCodes from "$lib/utils/http-codes";
import db from "$lib/server/database/";
import log, { logError } from "$lib/logging";


export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["Admin"])],
    async ({ request, locals }) => {
        const data = await request.json()
        const userId = locals.user!.id

        const parsingResult = AppSettingsSchema.safeParse(data)
        if (!parsingResult.success) {
            return json({
                message: "Invalid Data"
            }, {
                status: HttpCodes.ClientError.BadRequest
            })
        }

        try {
            await db.config.setSettings(parsingResult.data)
            await log("info", `Settings updated`, userId, data)
            return json({
                message: "Settings updated"
            })
        } catch (err) {
            await logError(err, `Error updating settings`, userId)
            return json({
                message: "Error updating settings"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }
    }
)