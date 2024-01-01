import type { PageServerLoad } from "./$types"

import db from "$lib/server/database/"

export const load: PageServerLoad = async () => {
    return {
        books: await db.book.getAllBooks(),
        authors: await db.book.getAllAuthors(),
        publishers: await db.book.getAllPublishers(),
        languages: await db.book.getAllLanguages(),
        locations: await db.book.getAllLocations()
    }
}
