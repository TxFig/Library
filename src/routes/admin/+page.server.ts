import { validate } from "uuid";
import type { PageServerLoad } from "./$types";
import db from "$lib/server/database/";


export const load: PageServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")
    const loggedIn = sessionToken && validate(sessionToken)

    return {
        users: loggedIn ? db.auth.getAllUsers() : []
    }
}
