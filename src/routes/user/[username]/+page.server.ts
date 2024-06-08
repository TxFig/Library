import db from "$lib/server/database/"
import { error } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes.js"


export const load = async ({ params }) => {
    const user = await db.auth.user.getUserByUsername(params.username)

    if (!user) {
        error(HttpCodes.ClientError.NotFound, { message: "User not found" })
    }

    return {
        pageUser: user
    }
}
