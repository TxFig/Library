import { getUserBySessionToken } from "$lib/server/database/auth";
import type { LayoutServerLoad } from "./$types";


export const load: LayoutServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")
    const user = sessionToken ? await getUserBySessionToken(sessionToken) : null

    return { user }
}
