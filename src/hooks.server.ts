import { close } from "$lib/server/database/"
import db from "$lib/server/database/"
import type { Handle } from "@sveltejs/kit"


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
    const sessionToken = event.cookies.get("sessionToken")
    event.locals.user = sessionToken ? await db.auth.getUserBySessionToken(sessionToken) : null

    return await resolve(event)
}

process.on("exit", () => {
    close()
})
