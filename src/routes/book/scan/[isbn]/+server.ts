import { json, error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

import { getOpenLibraryBook } from "$lib/utils/open-library"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import type { BookCreateData } from "$lib/validation/book/book-form"
import { generateResizedImages } from "$lib/utils/images"
import { applyDecorators } from "$lib/decorators"
import { ParseParamsDecorator } from "$lib/decorators/parse-params"
import AuthDecorator from "$lib/decorators/auth"


export const POST: RequestHandler = applyDecorators(
    [
        AuthDecorator(["Create Book"]),
        ParseParamsDecorator({
            isbn: {
                schema: ISBNSchema,
                onError: () => error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
            }
        })
    ],
    async ({ params, locals }) => {
        const { isbn } = params

        const bookAlreadyExists = await db.books.book.doesBookExist(isbn)
        if (bookAlreadyExists) {
            error(HttpCodes.ClientError.Conflict, {
                message: "Book already exists in database.",
            })
        }

        const data = await getOpenLibraryBook(isbn)

        if (!data) {
            error(HttpCodes.ClientError.NotFound, {
                message: "Book not available in OpenLibrary.",
            })
        }

        const createBookData: BookCreateData = {
            ...data,
            front_image: false,
            back_image: false
        }

        if (data.front_image) {
            await generateResizedImages(data.isbn, "front", data.front_image)
            createBookData.front_image = true
        }
        if (data.back_image) {
            await generateResizedImages(data.isbn, "back", data.back_image)
            createBookData.back_image = true
        }

        try {
            await db.books.book.createBook(createBookData)
            return json({
                status: 200,
                message: "Successfully added Book"
            })
        } catch (error) {
            return json({
                status: 500,
                message: "Error adding Book"
            })
        }
    }
)