import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { validate } from "uuid"


export const GET: RequestHandler = async ({ cookies, url }) => {
    const sessionToken = cookies.get("sessionToken")

    if (sessionToken && validate(sessionToken)) {
        await db.auth.deleteSessionByToken(sessionToken)
        cookies.delete("sessionToken", {
            path: "/"
        })
    }

    const path = url.searchParams.get("path")
    throw redirect(HttpCodes.SeeOther, path ?? "/")
}
