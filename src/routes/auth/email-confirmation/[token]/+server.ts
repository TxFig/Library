import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validate } from "uuid"
import db from "$lib/server/database/";
import HttpCodes from "$lib/utils/http-codes";


export const GET: RequestHandler = async ({ params, cookies, url }) => {
    const { token } = params

    if (!validate(token)) {
        throw redirect(HttpCodes.SeeOther, "/auth/login/")
    }

    const emailConfirmationRequest = await db.auth.getEmailConfirmationRequestByToken(token)
    if (!emailConfirmationRequest) {
        throw redirect(HttpCodes.SeeOther, "/auth/login/")
    }
    else if (emailConfirmationRequest && !db.auth.validateExpireTime(emailConfirmationRequest.expireDate)) {
        await db.auth.deleteEmailConfirmationRequestByToken(token)
        throw redirect(HttpCodes.SeeOther, "/auth/login/")
    }

    await db.auth.deleteEmailConfirmationRequestByToken(token)

    const sessionToken = await db.auth.createSession(emailConfirmationRequest.userId)
    cookies.set("sessionToken", sessionToken, {
        path: "/"
    })

    const redirectPath = url.searchParams.get("redirect")
    if (redirectPath) redirect(HttpCodes.SeeOther, redirectPath)
    else redirect(HttpCodes.SeeOther, "/auth/email-confirmation/success/")
}
