import { close } from "$lib/server/database/"
import { getUserBySessionToken } from "$lib/server/database/auth"
import type { Handle } from "@sveltejs/kit"


export const handle: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get("sessionToken")
    event.locals.user = sessionToken ? await getUserBySessionToken(sessionToken) : null

    return await resolve(event)
}

process.on("exit", () => {
    close()
})
