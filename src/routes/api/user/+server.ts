import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import db from "$lib/server/database/";
import HttpCodes from "$lib/utils/http-codes";


//* Create User
export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(HttpCodes.Unauthorized, {
            message: "Need to be logged in to create users"
        })
    }

    const data = await request.json()

    if (!(data.email && data.username)) {
        throw error(HttpCodes.BadRequest, {
            message: "Invalid Request"
        })
    }

    try {
        const user = await db.auth.createUser({
            email: data.email,
            username: data.username
        })
        return json({
            status: 200,
            message: "Successfully Created User",
            user
        })
    } catch (error) {
        return json({
            status: 500,
            message: "Error Creating User"
        })
    }
}
