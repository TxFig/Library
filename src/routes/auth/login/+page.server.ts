import db from "$lib/server/database/";
import { fail, type Actions } from "@sveltejs/kit";
import HttpCodes from "$lib/utils/http-codes"
import { EmailSchema } from "$lib/validation/auth/user";
import { decode as decodeFormData } from "decode-formdata";


export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()
        const decodedData = decodeFormData(formData)
        const parsingResult = EmailSchema.safeParse(decodedData)

        if (!parsingResult.success) {
            return fail(HttpCodes.ClientError.BadRequest, {
                message: "Invalid Email"
            })
        }

        const email = parsingResult.data
        const user = await db.auth.getUserByEmail(email)
        if (!user) {
            return fail(HttpCodes.ClientError.BadRequest, {
                message: "User doesn't exist"
            })
        }

        if (
            user.emailConfirmationRequest &&
            !db.auth.validateExpireTime(user.emailConfirmationRequest.expireDate)
        ) {
            return fail(HttpCodes.ClientError.BadRequest, {
                message: "A email confirmation request already was sent"
            })
        }

        const error = await db.auth.sendConfirmationEmail(user)
        if (error) {
            return fail(HttpCodes.ServerError.InternalServerError, {
                message: "Error sending email"
            })
        }

        return {
            message: "Confirmation email was sent"
        }
    }
}
