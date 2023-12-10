import { validate } from "uuid";
import type { PageServerLoad } from "./$types";
import { getAllUsers } from "$lib/server/database/auth";


export const load: PageServerLoad = async ({ cookies }) => {
    const sessionToken = cookies.get("sessionToken")
    if (!sessionToken || !validate(sessionToken)) return {}
    return {
        users: getAllUsers()
    }
}
