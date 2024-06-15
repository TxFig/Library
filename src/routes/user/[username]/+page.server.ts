import db from "$lib/server/database/"
import { error, fail } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"


export const load = async ({ params, locals }) => {
    const user = await db.auth.user.getUserByUsername(params.username)

    if (!user) {
        error(HttpCodes.ClientError.NotFound, { message: "User not found" })
    }


    const isCurrentUser = user.id === locals.user?.id

    return {
        pageUser: user,
        isCurrentUser
    }
}
