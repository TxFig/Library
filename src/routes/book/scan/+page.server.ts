import type { PageServerLoad } from "./$types";
import db from "$lib/server/database"
import applyTransformSpec from "$lib/utils/transform-object";
import { ScanPage } from "$lib/types";


export const load: PageServerLoad = async () => ({
    books: applyTransformSpec(
        await db.books.book.getAll({
            include: ScanPage.BookWithEditions.include
        }),
        ScanPage.BookWithEditions.spec
    )
})
