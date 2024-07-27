import type { PageServerLoad } from "./$types"
import db from "$lib/server/database/"
import { redirect } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"


export const load: PageServerLoad = async () => {
    const initialSetup = await db.config.getInitialSetup()
    if (!initialSetup) {
        redirect(HttpCodes.Found, "/admin/initial-setup")
    }

    return {
        books: await db.books.book.getAllBooks(),
        authors: await db.books.author.getAllAuthors(),
        publishers: await db.books.publisher.getAllPublishers(),
        languages: await db.books.language.getAllLanguages(),
        locations: await db.books.location.getAllLocations()
    }
}
