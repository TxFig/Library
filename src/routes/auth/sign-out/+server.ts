import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import db from "$lib/server/database/";
import HttpErrors from "$lib/utils/http-errors"


export const GET: RequestHandler = async ({ cookies, url }) => {
    const sessionToken = cookies.get("sessionToken")
    if (sessionToken) {
        await db.auth.deleteSession(sessionToken)
        cookies.delete("sessionToken", {
            path: "/"
        })
    }

    const path = url.searchParams.get("path")
    throw redirect(HttpErrors.SeeOther, path ?? "/")
}
