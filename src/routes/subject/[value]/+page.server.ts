import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"


export const load: PageServerLoad = async ({ params }) => {
    const { value } = params
    const subject = await db.books.subject.getSubjectWithBooksByName(value, { image: true })

    if (!subject) {
        error(HttpCodes.ClientError.NotFound, "Subject doesn't exists")
    }

    return { subject }
}
