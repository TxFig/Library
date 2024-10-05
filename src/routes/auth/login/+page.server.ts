import db from "$lib/server/database/";
import { fail, type Actions } from "@sveltejs/kit";
import HttpCodes from "$lib/utils/http-codes"
import { EmailSchema } from "$lib/validation/utils";
import isDateExpired from "$lib/utils/is-date-expired";


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
        const user = await db.auth.user.getUniqueUser({
            where: { email },
            include: { emailConfirmationRequest: true }
        })
        if (!user) {
            return fail(HttpCodes.ClientError.BadRequest, {
                error: undefined,
                message: "User doesn't exist"
            })
        }

        if (user.emailConfirmationRequest) {
            if (!isDateExpired(user.emailConfirmationRequest.expireDate)) {
                return fail(HttpCodes.ClientError.BadRequest, {
                    error: undefined,
                    message: "A email confirmation request already was sent"
                })
            } else {
                db.auth.emailConfirmation.deleteEmailConfirmationRequestByToken(
                    user.emailConfirmationRequest.token
                )
            }
        }

        const redirectPath = url.searchParams.get("redirect") ?? undefined
        try {
            await db.auth.emailConfirmation.sendConfirmationEmailAndSaveRequest(user, redirectPath)
        } catch {
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
