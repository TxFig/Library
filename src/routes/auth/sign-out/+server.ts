import { error, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { validate } from "uuid"
import { env } from "$env/dynamic/private"
import { env as publicEnv } from "$env/dynamic/public"
import { logError } from "$lib/server/database/logs"


export const GET: RequestHandler = async ({ cookies, url }) => {
    const sessionToken = cookies.get(env.SESSION_COOKIE_NAME)

    if (sessionToken && validate(sessionToken)) {
        try {
            await db.auth.session.deleteSessionByToken(sessionToken)
            cookies.delete(env.SESSION_COOKIE_NAME, {
                path: "/"
            })
        } catch (err) {
            await logError(err, `Error deleting session database, (${sessionToken})`)
            error(HttpCodes.ServerError.InternalServerError, {
                message: "Internal Server Error"
            })
        }
    }

    const path = url.searchParams.get(publicEnv.PUBLIC_REDIRECT_QUERY_KEY)
    throw redirect(HttpCodes.SeeOther, path ?? "/")
}
