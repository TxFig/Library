import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { validate } from "uuid"
import db from "$lib/server/database/";
import HttpErrors from "$lib/utils/http-errors";


export const load: PageServerLoad = async ({ params, cookies }) => {
    const { token } = params

    if (!validate(token)) {
        throw redirect(HttpErrors.SeeOther, "/auth/login/")
    }

    const emailConfirmationRequest = await db.auth.getEmailConfirmationRequestByToken(token)
    if (!emailConfirmationRequest) {
        throw redirect(HttpErrors.SeeOther, "/auth/login/")
    }
    else if (emailConfirmationRequest && !db.auth.validateExpireTime(emailConfirmationRequest.expireDate)) {
        await db.auth.deleteEmailConfirmationRequestByToken(token)
        throw redirect(HttpErrors.SeeOther, "/auth/login/")
    }

    await db.auth.deleteEmailConfirmationRequestByToken(token)

    const sessionToken = await db.auth.createSession(emailConfirmationRequest.userId)
    cookies.set("sessionToken", sessionToken, {
        path: "/"
    })

    return {
        user: emailConfirmationRequest.user
    }
}
