// import type { PageServerLoad } from "./$types"
// import db from "$lib/server/database/"
// import { redirect } from "@sveltejs/kit"
// import HttpCodes from "$lib/utils/http-codes"
// // import { BookEditionWithSearchPropertiesInclude } from "$lib/types"


// export const load: PageServerLoad = async () => {
//     const initialSetup = await db.config.getInitialSetup()
//     if (!initialSetup) {
//         redirect(HttpCodes.Found, "/admin/initial-setup")
//     }

//     return {
//         editions: await db.books.edition.getAll({ include: BookEditionWithSearchPropertiesInclude }),
//         authors: await db.books.author.getAll(),
//         publishers: await db.books.publisher.getAllPublishers(),
//     }
// }
