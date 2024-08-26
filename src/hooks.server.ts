import { env } from "$env/dynamic/private"
import { logFatal } from "$lib/logging";
import db from "$lib/server/database/"
import isDateExpired from "$lib/utils/is-date-expired";
import { validateEnvVariables } from "$lib/validation/env-vars";
import type { Handle, RequestEvent } from "@sveltejs/kit"
import { validate as validateUUID } from "uuid"


async function handleAuth(event: RequestEvent): Promise<RequestEvent> {
    async function resolveWithoutUserAndSession() {
        event.cookies.delete(env.SESSION_COOKIE_NAME, { path: "/" })
        event.locals.user = null
        event.locals.session = null
        return event
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
    return event
}

export const handle: Handle = async ({ event, resolve }) => {
    try {
        const authEvent = await handleAuth(event)
        return await resolve(authEvent)
    } catch (err) {
        await logFatal(err, "error handling request")
        throw err
    }
}

await validateEnvVariables(env)
