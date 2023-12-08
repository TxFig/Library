import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/book"


export const load: PageServerLoad = async ({ params }) => {
    const { name } = params
    const publisher = await db.getPublisherWithBooksByName(name)

    if (!publisher) {
        throw error(404, "Publisher Doesn't Exists")
    }

    return { publisher }
}
