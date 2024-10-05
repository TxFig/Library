import type { PageServerLoad } from "./$types"
import db from "$lib/server/database/"
import { error, redirect } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import { env } from "$env/dynamic/private"
import { UserCreateSchema } from "$lib/validation/auth/user"
import { fail, message, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"


export const load: PageServerLoad = async () => {
    const initialSetup = await db.config.getInitialSetup()
    if (initialSetup) {
        redirect(HttpCodes.Found, "/admin")
    }

    if (env.ADMIN_EMAIL) {
        try {
            const doesUserExist = await db.auth.user.doesUserExist({ email: env.ADMIN_EMAIL })
            if (doesUserExist) {
                return {
                    providedEmail: true,
                    form: await superValidate(zod(UserCreateSchema))
                }
            }
        } catch {
            error(HttpCodes.ServerError.InternalServerError, {
                message: "Internal Server Error"
            })
        }

        const user = await db.auth.user.createUser({
            email: env.ADMIN_EMAIL,
            username: "Admin",
            permissionGroup: "Admin"
        })

        try {
            await db.auth.emailConfirmation.sendConfirmationEmailAndSaveRequest(user, "/admin")
        } catch {
            error(HttpCodes.ServerError.InternalServerError, {
                error: undefined,
                message: "Error sending confirmation email"
            })
        }

        return {
            providedAdminEmail: true,
            form: await superValidate(zod(UserCreateSchema))
        }
    }

    return {
        providedAdminEmail: false,
        form: await superValidate(zod(UserCreateSchema))
    }
}


export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData()
        formData.set("permissionGroup", "Admin")

        const form = await superValidate(formData, zod(UserCreateSchema))
        if (!form.valid) {
            return fail(HttpCodes.ClientError.BadRequest, { form })
        }

        try {
            const doesUserExist = await db.auth.user.doesUserExist({ email: form.data.email })
            if (doesUserExist) {
                return message(form, {
                    type: "error",
                    text: "Confirmation email already sent"
                })
            }
        } catch (err) {
            error(HttpCodes.ServerError.InternalServerError, {
                message: "Internal Server Error"
            })
        }

        const user = await db.auth.user.createUser(form.data)

        try {
            await db.auth.emailConfirmation.sendConfirmationEmailAndSaveRequest(user, "/admin")
        } catch {
            return message(form, {
                type: "error",
                text: "Error sending confirmation email"
            })
        }

        return message(form, {
            type: "success",
            text: "Confirmation email sent"
        })
    }
}
