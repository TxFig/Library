import { SESSION_COOKIE_NAME } from "$env/static/private"
import db from "$lib/server/database/"
import { isSessionValid } from "$lib/server/database/auth";
import type { Handle } from "@sveltejs/kit"
import { validate as validateUUID } from "uuid"


// https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006088574
declare global {
    interface BigInt {
        /** Convert to BigInt to string form in JSON.stringify */
        toJSON: () => string;
    }
}

BigInt.prototype.toJSON = function() { return this.toString() }
// ----------------------------------------------------------------------------


export const handle: Handle = async ({ event, resolve }) => {
    async function resolveWithoutUserAndSession() {
        event.cookies.delete(SESSION_COOKIE_NAME, { path: "/" })
        event.locals.user = null
        event.locals.session = null
        return await resolve(event)
    }

    const sessionToken = event.cookies.get(SESSION_COOKIE_NAME)

    if (
        !sessionToken ||
        (sessionToken && !validateUUID(sessionToken))
    ) return resolveWithoutUserAndSession()

    const { user, session } = await db.auth.getUserAndSessionBySessionToken(sessionToken)

    if (!session) return resolveWithoutUserAndSession()

    if (session && !isSessionValid(session)) {
        await db.auth.deleteSessionByToken(sessionToken)
        return resolveWithoutUserAndSession()
    }

    event.locals.user = user
    event.locals.session = session
    return await resolve(event)
}

process.on("exit", () => {
    db.close()
})
