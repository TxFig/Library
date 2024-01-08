import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"


export const load: PageServerLoad = async ({ params }) => {
    const { name } = params
    const publisher = await db.book.getPublisherWithBooksByName(name)

    if (!publisher) {
        throw error(HttpCodes.NotFound, "Publisher Doesn't Exists")
    }

    return { publisher }
}
