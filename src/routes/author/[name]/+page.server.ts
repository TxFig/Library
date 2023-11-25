import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"


export const load: PageServerLoad = async ({ params }) => {
    const { name } = params
    const author = await db.getAuthorWithBooksByName(name)

    if (!author) {
        throw error(404, "Author Doesn't Exists")
    }

    return { author }
}
