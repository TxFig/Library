import paramsValidator from "$lib/request-validators/params"
import { PublicIdSchema } from "$lib/validation/publicId"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import HttpCodes from "$lib/utils/http-codes"
import db from "$lib/server/database/"
import { BookPage } from "$lib/types"
import applyTransformSpec from "$lib/utils/transform-object"
import transforms from "$lib/transforms"


export const load: PageServerLoad = async function(event) {
    paramsValidator(event, {
        bookPublicId: {
            schema: PublicIdSchema,
            onInvalid: () => error(HttpCodes.ClientError.BadRequest, "Invalid Book Public Id"),
        }
    })

    const { url, locals, params } = event
    const { bookPublicId } = params

    let rawBook: BookPage.DisplayBook.Raw | null
    try {
        rawBook = await db.books.book.getUnique({
            where: { publicId: bookPublicId },
            include: BookPage.DisplayBook.include(locals.user?.id)
        })
    } catch (err) {
        error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
    }
    if (!rawBook) {
        error(HttpCodes.ClientError.NotFound, "Book Not Found")
    }
    const book = applyTransformSpec(rawBook, BookPage.DisplayBook.spec)

    const editionPublicId = url.searchParams.get("edition")
    const editionIndex = book.editions.findIndex(edition => edition.id === editionPublicId)
    let selectedEditionIndex = 0
    if (editionIndex !== -1) {
        selectedEditionIndex = editionIndex
    }

    const ratings = rawBook.editions.map(edition =>
        edition.ratings.find(rating =>
            rating.userId === locals.user?.id
        )?.rating
    )
    // Remove user's ratings from all
    book.editions = book.editions.map((edition, index) => {
        const ratingIndex = edition.ratings.findIndex(rating => rating === ratings[index])
        if (ratingIndex !== -1)
            edition.ratings.splice(ratingIndex, 1)
        return edition
    })

    const readingStates = rawBook.editions.map(edition =>
        edition.readingStates.map(readingState => readingState.state)[0]
    )

    const copyRequests = rawBook.editions.map(edition =>
        edition.copies.map(copy =>
            copy.requests.length !== 0
            ? applyTransformSpec(copy.requests[0], { $: transforms.copyRequest })
            : undefined
        )
    )

    return {
        book,
        selectedEditionIndex,
        ratings,
        readingStates,
        copyRequests
    }
}
