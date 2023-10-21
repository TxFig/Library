import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import db from "$lib/server/database"


export const DELETE: RequestHandler = async ({ params }) => {
    const { isbn } = params

    await db.deleteBookInfo(isbn)

    return json({ message: `Successfully deleted book, isbn ${isbn}` })
}
