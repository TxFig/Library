import { logError } from "$lib/server/database/logs";
import db from "$lib/server/database/";
import HttpCodes from "$lib/utils/http-codes";
import { LoginSchema } from "$lib/validation/auth/login";
import type { Prisma } from "@prisma/client";
import { fail, type Actions } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";


export const load: PageServerLoad = async ({ url }) => ({
    form: await superValidate({
        email: url.searchParams.get("email") ?? ""
    }, valibot(LoginSchema), { errors: false })
})

export const actions: Actions = {
    default: async function({ request, url }) {
        const formData = await request.formData()
        const form = await superValidate(formData, valibot(LoginSchema))

        if (!form.valid) {
            return fail(HttpCodes.ClientError.BadRequest, { form })
        }

        const email = form.data.email
        let user: Prisma.UserGetPayload<{
            include: { emailConfirmationRequest: true }
        }> | null
        try {
            user = await db.auth.user.getUnique({
                where: { email },
                include: { emailConfirmationRequest: true }
            })
        } catch (err) {
            await logError(err, "Error retrieving user from database")
            return message(form, {
                type: "error",
                text: "Internal Server Error"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }

        if (!user) {
            return message(form, {
                type: "error",
                text: "User not found"
            }, {
                status: HttpCodes.ClientError.NotFound
            })
        }

        if (user.emailConfirmationRequest) {
            if (user.emailConfirmationRequest.expireDate > new Date()) {
                return message(form, {
                    type: "error",
                    text: "Confirmation email already sent"
                }, {
                    status: HttpCodes.ClientError.Conflict
                })
            }
            try {
                await db.auth.emailConfirmation.deleteByToken(
                    user.emailConfirmationRequest.token
                )
            } catch (err) {
                await logError(err, "Error deleting email confirmation request from database")
                return message(form, {
                    type: "error",
                    text: "Internal Server Error"
                }, {
                    status: HttpCodes.ServerError.InternalServerError
                })
            }
        }

        const redirectPath = url.searchParams.get(env.PUBLIC_REDIRECT_QUERY_KEY) ?? undefined
        try {
            await db.auth.emailConfirmation.sendEmailAndCreateRequest(user, redirectPath)
        } catch {
            return message(form, {
                type: "error",
                text: "Error sending email"
            }, {
                status: HttpCodes.ServerError.InternalServerError
            })
        }

        return message(form, {
            type: "success",
            text: "Confirmation email was sent"
        })
    }
}
