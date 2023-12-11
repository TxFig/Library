import { validate } from "uuid";
import type { PageServerLoad } from "./$types";
import { getAllUsers } from "$lib/server/database/auth";


export const load: PageServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")
    const loggedIn = sessionToken && validate(sessionToken)

    return {
        users: loggedIn ? getAllUsers() : []
    }
}
