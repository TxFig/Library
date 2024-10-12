import type { PageServerLoad } from "./$types"
import db from "$lib/server/database/"
import { redirect } from "@sveltejs/kit"
import HttpCodes from "$lib/utils/http-codes"
import { BookEditionWithSearchPropertiesInclude } from "$lib/server/database/books/types"


export const load: PageServerLoad = async () => {
    const initialSetup = await db.config.getInitialSetup()
    if (!initialSetup) {
        redirect(HttpCodes.Found, "/admin/initial-setup")
    }

    return {
        editions: await db.books.edition.getEditions({ include: BookEditionWithSearchPropertiesInclude }),
        authors: await db.books.author.getAllAuthors(),
        publishers: await db.books.publisher.getAllPublishers(),
    }
}
