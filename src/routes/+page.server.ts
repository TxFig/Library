import type { PageServerLoad } from "./$types"

import db from "$lib/server/database/"

export const load: PageServerLoad = async () => {
    return {
        books: await db.getAllBooks(),
        authors: await db.getAllAuthors(),
        publishers: await db.getAllPublishers(),
        languages: await db.getAllLanguages(),
        locations: await db.getAllLocations()
    }
}
