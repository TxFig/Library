import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import HttpCodes from "$lib/utils/http-codes";

export const load: PageServerLoad = ({ locals }) => {
    if (!locals.user)
        return error(HttpCodes.ClientError.Unauthorized)

    return {
        username: locals.user.username
    }
}
