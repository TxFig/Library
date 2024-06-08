import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import clearEmptyFields from "$lib/utils/clear-empty-fields"
import { ReadingStateUpdateSchema } from "$lib/validation/reading-state"
import { hasPermission } from "$lib/utils/permissions"
import { ActivityType } from "@prisma/client"


//* Update User-Book Reading State
export const PATCH: RequestHandler = async ({ request, locals }) => {
    if (!locals.user || !hasPermission(locals.user, "Edit Book")) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const data = await request.json()
    const clearedData = clearEmptyFields(data)
    const parsingResult = ReadingStateUpdateSchema.safeParse(clearedData)

    if (!parsingResult.success) {
        error(HttpCodes.ClientError.BadRequest, {
            message: "Invalid Request"
        })
    }

    const parsedData = parsingResult.data

    try {
        await db.auth.readingState.updateUserReadingState(parsedData.bookId, locals.user.id, parsedData.state)
        await db.activityLog.logActivity(locals.user.id, ActivityType.READING_STATE_UPDATED, {
            bookId: parsedData.bookId,
            userId: locals.user.id,
            state: parsedData.state
        })
        return json({
            status: 200,
            message: "Successfully Updated Reading State"
        })
    } catch (error) {
        return json({
            status: 500,
            message: "Error Updating Reading State"
        })
    }

}
