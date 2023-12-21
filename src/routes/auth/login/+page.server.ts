import { getUserByEmail, sendConfirmationEmail, validateExpireTime } from "$lib/server/database/auth";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()

        const email = formData.get("email")
        if (typeof email !== "string") {
            return fail(400, {
                message: "Invalid Email"
            })
        }

        const user = await getUserByEmail(email)
        if (!user) {
            return fail(400, {
                message: "User doesn't exist"
            })
        }

        if (
            user.emailConfirmationRequest &&
            !validateExpireTime(user.emailConfirmationRequest.expireDate)
        ) {
            return fail(400, {
                message: "A email confirmation request already was sent"
            })
        }

        const error = await sendConfirmationEmail(user)
        if (error) {
            return fail(500, {
                message: "Error sending email"
            })
        }

        return {
            message: "Confirmation email was sent"
        }
    }
}
