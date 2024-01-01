import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpErrors from "$lib/utils/http-errors"


export const load: PageServerLoad = async ({ params }) => {
    const { name } = params
    const publisher = await db.book.getPublisherWithBooksByName(name)

    if (!publisher) {
        throw error(HttpErrors.NotFound, "Publisher Doesn't Exists")
    }

    return { publisher }
}
