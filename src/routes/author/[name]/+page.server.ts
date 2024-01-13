import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"


export const load: PageServerLoad = async ({ params }) => {
    const { name } = params
    const author = await db.book.getAuthorWithBooksByName(name)

    if (!author) {
        error(HttpCodes.NotFound, "Author Doesn't Exists")
    }

    return { author }
}
