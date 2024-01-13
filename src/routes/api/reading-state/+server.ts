import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import type { AllReadingState } from "$lib/server/database/auth"


export type UpdateUserBookReadingStateData = {
    state: AllReadingState,
    isbn: bigint
}

//* Update User-Book Reading State
export const PATCH: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        error(HttpCodes.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    const data: UpdateUserBookReadingStateData = await request.json() // TODO: validate data
    await db.auth.updateUserReadingState(data.isbn, locals.user.id, data.state)

    return new Response()
}
