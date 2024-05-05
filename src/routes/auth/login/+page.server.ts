import db from "$lib/server/database/";
import { fail, type Actions } from "@sveltejs/kit";
import HttpCodes from "$lib/utils/http-codes"
import { EmailSchema } from "$lib/validation/auth/user";


export const actions: Actions = {
    default: async ({ request, url }) => {
        const formData = await request.formData()
        const data = formData.get("email")
        const parsingResult = EmailSchema.safeParse(data)

        if (!parsingResult.success) {
            return fail(HttpCodes.ClientError.BadRequest, {
                error: parsingResult.error.errors[0].message,
                message: undefined
            })
        }

        const email = parsingResult.data
        const user = await db.auth.getUserByEmail(email)
        if (!user) {
            return fail(HttpCodes.ClientError.BadRequest, {
                error: undefined,
                message: "User doesn't exist"
            })
        }

        if (user.emailConfirmationRequest) {
            if (db.auth.validateExpireTime(user.emailConfirmationRequest.expireDate)) {
                return fail(HttpCodes.ClientError.BadRequest, {
                    error: undefined,
                    message: "A email confirmation request already was sent"
                })
            } else {
                db.auth.deleteEmailConfirmationRequestByToken(
                    user.emailConfirmationRequest.token
                )
            }
        }

        const redirectPath = url.searchParams.get("redirect") ?? undefined
        const error = await db.auth.sendConfirmationEmail(user, redirectPath)
        if (error) {
            return fail(HttpCodes.ServerError.InternalServerError, {
                error: undefined,
                message: "Error sending email"
            })
        }

        return {
            message: "Confirmation email was sent"
        }
    }
}
