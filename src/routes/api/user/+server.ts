import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import clearEmptyFields from "$lib/utils/clear-empty-fields"
import { UserCreateSchema } from "$lib/validation/auth/user"


//* Create User
export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in to create users"
        })
    }

    const data = await request.json()
    const clearedData = clearEmptyFields(data)
    const parsingResult = UserCreateSchema.safeParse(clearedData)

    if (!parsingResult.success) {
        error(HttpCodes.ClientError.BadRequest, {
            message: "Invalid Request"
        })

    }
    const parsedData = parsingResult.data

    try {
        const user = await db.auth.createUser({
            email: parsedData.email,
            username: parsedData.username,
            admin: false
        })
        return json({
            status: 200,
            message: "Successfully Created User",
            data: { user }
        })
    } catch (error) {
        return json({
            status: 500,
            message: "Error Creating User"
        })
    }
}
