import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database"

export const load: PageServerLoad = async ({ params }) => {
    const { name } = params
    const publisher = await db.getPublisherByName(name)

    if (!publisher) {
        throw error(404, "Publisher Doesn't Exists")
    }

    const books = await db.getBooksByPublisher(publisher)

    return { publisher, books }
}
