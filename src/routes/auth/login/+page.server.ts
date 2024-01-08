import db from "$lib/server/database/";
import { fail, type Actions } from "@sveltejs/kit";
import HttpCodes from "$lib/utils/http-codes"


export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()

        const email = formData.get("email")
        if (typeof email !== "string") {
            return fail(HttpCodes.BadRequest, {
                message: "Invalid Email"
            })
        }

        const user = await db.auth.getUserByEmail(email)
        if (!user) {
            return fail(HttpCodes.BadRequest, {
                message: "User doesn't exist"
            })
        }

        if (
            user.emailConfirmationRequest &&
            !db.auth.validateExpireTime(user.emailConfirmationRequest.expireDate)
        ) {
            return fail(HttpCodes.BadRequest, {
                message: "A email confirmation request already was sent"
            })
        }

        const error = await db.auth.sendConfirmationEmail(user)
        if (error) {
            return fail(HttpCodes.InternalServerError, {
                message: "Error sending email"
            })
        }

        return {
            message: "Confirmation email was sent"
        }
    }
}
