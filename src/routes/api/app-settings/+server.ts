import { applyDecorators } from "$lib/decorators";
import AuthDecorator from "$lib/decorators/auth";
import { AppSettingsSchema } from "$lib/validation/app-settings";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import HttpCodes from "$lib/utils/http-codes";
import db from "$lib/server/database/";


export const PATCH: RequestHandler = applyDecorators(
    [AuthDecorator(["Admin"])],
    async ({ request }) => {
        const data = await request.json()

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
            return json({
                message: "Settings updated"
            })
        } catch {
            return json({
                message: "Error updating settings"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }
    }
)