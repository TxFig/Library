import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import clearEmptyFields from "$lib/utils/clear-empty-fields"
import { ReadingStateUpdateSchema } from "$lib/validation/reading-state"


//* Update User-Book Reading State
export const PATCH: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
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
