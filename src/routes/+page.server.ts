import type { PageServerLoad } from "./$types"
import db from "$lib/server/database/"


export const load: PageServerLoad = async () => {
    return {
        books: await db.books.book.getAllBooks(),
        authors: await db.books.author.getAllAuthors(),
        publishers: await db.books.publisher.getAllPublishers(),
        languages: await db.books.language.getAllLanguages(),
        locations: await db.books.location.getAllLocations()
    }
}
