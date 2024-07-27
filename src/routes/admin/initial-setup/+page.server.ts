import type { PageServerLoad } from "./$types"
import db from "$lib/server/database/"
import { error, redirect } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import { env } from "$env/dynamic/private"
import { UserCreateSchema } from "$lib/validation/auth/user"


export const load: PageServerLoad = async () => {
    const usersCount = await db.auth.user.getUserCount()

    if (usersCount > 0) {
        redirect(HttpCodes.SeeOther, "/admin")
    }

    if (env.ADMIN_EMAIL) {
        const user = await db.auth.user.createUser({
            email: env.ADMIN_EMAIL,
            username: "Admin",
            permissionGroup: "Admin"
        })

        const err = await db.auth.emailConfirmation.sendConfirmationEmailAndSaveRequest(user, "/admin")
        if (err) error(HttpCodes.ServerError.InternalServerError, {
            error: undefined,
            message: "Error sending confirmation email"
        })

        return { providedAdminEmail: true }
    }

    return { providedAdminEmail: false }
}


export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData()
        const email = formData.get("email")
        const username = formData.get("username")

        const parsingResult = UserCreateSchema.safeParse({
            email, username,
            permissionGroup: "Admin"
        })

        if (!parsingResult.success) {
            return { error: "Invalid email or username", data: { email, username } }
        }

        const user = await db.auth.user.createUser(parsingResult.data)

        const err = await db.auth.emailConfirmation.sendConfirmationEmailAndSaveRequest(user, "/admin")
        if (err) error(HttpCodes.ServerError.InternalServerError, {
            error: undefined,
            message: "Error sending confirmation email"
        })

        return { error: undefined, data: { email, username } }
    }
}
