import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { validate } from "uuid"
import { env } from "$env/dynamic/private"


export const GET: RequestHandler = async ({ cookies, url }) => {
    const sessionToken = cookies.get(env.SESSION_COOKIE_NAME)

    if (sessionToken && validate(sessionToken)) {
        await db.auth.session.deleteSessionByToken(sessionToken)
        cookies.delete(env.SESSION_COOKIE_NAME, {
            path: "/"
        })
    }

    const path = url.searchParams.get("redirectPath")
    throw redirect(HttpCodes.SeeOther, path ?? "/")
}
