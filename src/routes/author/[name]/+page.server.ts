import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpErrors from "$lib/utils/http-errors"


export const load: PageServerLoad = async ({ params }) => {
    const { name } = params
    const author = await db.book.getAuthorWithBooksByName(name)

    if (!author) {
        throw error(HttpErrors.NotFound, "Author Doesn't Exists")
    }

    return { author }
}
