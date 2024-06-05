import type { RequestHandler } from "./$types"
import { error } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import methods from "./index"


export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user || locals.user.permissionGroup.name != "Admin") {
        error(HttpCodes.ClientError.Unauthorized, {
            message: "Need to be logged in to create users"
        })
    }
    const data = await request.json()
    return methods.POST(data)
}
