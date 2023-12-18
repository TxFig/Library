import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { updateUserReadingState, type AllReadingState } from "$lib/server/database/auth"


export type UpdateUserBookReadingStateData = {
    state: AllReadingState,
    isbn: number
}

//* Update User-Book Reading State
export const PATCH: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, {
            message: "Need to be logged in"
        })
    }

    const data: UpdateUserBookReadingStateData = await request.json() // TODO: validate data
    await updateUserReadingState(data.isbn, locals.user.id, data.state)

    return new Response()
}
