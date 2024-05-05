import type { PageServerLoad } from "./$types"
import db from "$lib/server/database/"
import { error, redirect } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import { ADMIN_EMAIL } from "$env/static/private"


export const load: PageServerLoad = async () => {
    const usersCount = await db.auth.getUsersCount()

    if (usersCount > 0) {
        redirect(HttpCodes.SeeOther, "/admin")
    }

    if (ADMIN_EMAIL) {
        const user = await db.auth.createUser({
            email: ADMIN_EMAIL,
            username: "Admin",
            admin: true
        })

        const err = await db.auth.sendConfirmationEmail(user, "/admin")
        if (err) error(HttpCodes.ServerError.InternalServerError, {
            error: undefined,
            message: "Error sending confirmation email"
        })

        return { providedAdminEmail: true }
    }

    return { providedAdminEmail: false }
}
