import { error } from '@sveltejs/kit'
import HttpCodes from "$lib/utils/http-codes"


export const load = async ({ locals }) => {
    if (!locals.user) {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in"
        })
    }

    return {
        user: locals.user
    }
}
