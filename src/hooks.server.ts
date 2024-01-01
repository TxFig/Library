import { close } from "$lib/server/database/"
import db from "$lib/server/database/"
import type { Handle } from "@sveltejs/kit"


export const handle: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get("sessionToken")
    event.locals.user = sessionToken ? await db.auth.getUserBySessionToken(sessionToken) : null

    return await resolve(event)
}

process.on("exit", () => {
    close()
})

import "$lib/utils/images"
