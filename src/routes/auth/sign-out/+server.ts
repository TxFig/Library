import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { deleteSession } from "$lib/server/database/auth";


export const GET: RequestHandler = async ({ cookies, url }) => {
    const sessionToken = cookies.get("sessionToken")
    if (sessionToken) {
        await deleteSession(sessionToken)
        cookies.delete("sessionToken", {
            path: "/"
        })
    }

    const path = url.searchParams.get("path")
    throw redirect(303, path ?? "/")
}
