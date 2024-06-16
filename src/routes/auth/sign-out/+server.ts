import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { validate } from "uuid"
import { SESSION_COOKIE_NAME } from "$env/static/private"


export const GET: RequestHandler = async ({ cookies, url }) => {
    const sessionToken = cookies.get(SESSION_COOKIE_NAME)

    if (sessionToken && validate(sessionToken)) {
        await db.auth.session.deleteSessionByToken(sessionToken)
        cookies.delete(SESSION_COOKIE_NAME, {
            path: "/"
        })
    }

    const path = url.searchParams.get("redirectPath")
    throw redirect(HttpCodes.SeeOther, path ?? "/")
}
