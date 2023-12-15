import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createUser } from "$lib/server/database/auth";


//* Create User
export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, {
            message: "Need to be logged in to create users"
        })
    }

    const data = await request.json()

    if (!(data.email && data.username)) {
        throw error(400, {
            message: "Invalid Request"
        })
    }

    try {
        const user = await createUser({
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
