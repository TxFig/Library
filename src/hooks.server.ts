import { env } from "$env/dynamic/private"
import db from "$lib/server/database/"
import isDateExpired from "$lib/utils/is-date-expired";
import type { Handle } from "@sveltejs/kit"
import { validate as validateUUID } from "uuid"


export const handle: Handle = async ({ event, resolve }) => {
    async function resolveWithoutUserAndSession() {
        event.cookies.delete(env.SESSION_COOKIE_NAME, { path: "/" })
        event.locals.user = null
        event.locals.session = null
        return await resolve(event)
    }

    const sessionToken = event.cookies.get(env.SESSION_COOKIE_NAME)

    if (
        !sessionToken ||
        (sessionToken && !validateUUID(sessionToken))
    ) return resolveWithoutUserAndSession()

    const { user, session } = await db.auth.session.getEntireUserAndSessionBySessionToken(sessionToken)

    if (!session) return resolveWithoutUserAndSession()

    if (session && isDateExpired(session.expireDate)) {
        await db.auth.session.deleteSessionByToken(sessionToken)
        return resolveWithoutUserAndSession()
    }

    event.locals.user = user
    event.locals.session = session
    return await resolve(event)
}
