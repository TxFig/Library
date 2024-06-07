import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validate } from "uuid"
import db from "$lib/server/database/";
import HttpCodes from "$lib/utils/http-codes";
import isDateExpired from "$lib/utils/is-date-expired";


export const GET: RequestHandler = async ({ params, cookies, url }) => {
    const { token } = params

    if (!validate(token)) {
        throw redirect(HttpCodes.SeeOther, "/auth/login/")
    }

    const emailConfirmationRequest = await db.auth.emailConfirmation.getEmailConfirmationRequestByToken(token)
    if (!emailConfirmationRequest) {
        throw redirect(HttpCodes.SeeOther, "/auth/login/")
    }
    else if (emailConfirmationRequest && isDateExpired(emailConfirmationRequest.expireDate)) {
        await db.auth.emailConfirmation.deleteEmailConfirmationRequestByToken(token)
        throw redirect(HttpCodes.SeeOther, "/auth/login/")
    }

    await db.auth.emailConfirmation.deleteEmailConfirmationRequestByToken(token)

    const { token: sessionToken, expireDate } = await db.auth.session.createSession(emailConfirmationRequest.userId)
    cookies.set("sessionToken", sessionToken, {
        path: "/",
        expires: expireDate
    })

    const redirectPath = url.searchParams.get("redirect")
    if (redirectPath) redirect(HttpCodes.SeeOther, redirectPath)
    else redirect(HttpCodes.SeeOther, "/auth/email-confirmation/success/")
}
