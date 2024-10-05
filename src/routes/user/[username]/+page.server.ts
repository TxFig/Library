import db from "$lib/server/database/"
import { error } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import { DisplayUserInclude } from "$lib/server/database/auth/types"


export const load = async ({ params, locals }) => {
    const user = await db.auth.user.getUniqueUser({
        where: { username: params.username },
        include: DisplayUserInclude
    })

    if (!user) {
        error(HttpCodes.ClientError.NotFound, { message: "User not found" })
    }


    const isCurrentUser = user.id === locals.user?.id

    return {
        pageUser: user,
        isCurrentUser,
    }
}
