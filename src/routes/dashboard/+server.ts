import type { RequestHandler } from "./$types"
import { redirect } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import urls from "$lib/urls"


export const GET: RequestHandler = function(event) {
    redirect(HttpCodes.Found, urls.dashboard.copies)
}
