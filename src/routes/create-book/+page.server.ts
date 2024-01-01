import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"

import db, { type InsertBookData } from "$lib/server/database/book"

import { ISBNSchema } from "$lib/utils/isbn"
import { bookFormSchema } from "$lib/utils/book-form"
import HttpErrors from "$lib/utils/http-errors"


export const load: PageServerLoad = async () => ({
    authors: await db.getAllAuthors(),
    publishers: await db.getAllPublishers(),
    subjects: await db.getAllSubjects(),
    locations: await db.getAllLocations(),
    languages: await db.getAllLanguages()
})

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(HttpErrors.Unauthorized, {
                message: "Need to be logged in"
            })
        }

        const formData = await request.formData()

        const isbnInput = formData.get("isbn")
        const isbnParsingResult = ISBNSchema.safeParse(isbnInput)
        if (!isbnParsingResult.success) {
            return fail(HttpErrors.BadRequest, {
                message: isbnParsingResult.error.issues[0].message
            })
        }
        const isbn = isbnParsingResult.data

        const bookAlreadyExists = await db.doesBookExist(isbn)
        if (bookAlreadyExists) {
            return fail(HttpErrors.Conflict, {
                message: "Book already exists in database.",
            })
        }

        const publishDateData = {
            day: formData.get("publish_date:day"),
            month: formData.get("publish_date:month"),
            year: formData.get("publish_date:year"),
        }
        const anyPublishDateData = !(publishDateData.day && publishDateData.month && publishDateData.year)


        const bookFormData = {
            book: {
                isbn: formData.get("isbn"),

                title: formData.get("title"),
                subtitle: formData.get("subtitle"),
                number_of_pages: formData.get("number_of_pages"),

                isbn10: formData.get("isbn10"), // TODO: create ui input for isbn 10 & 13
                isbn13: formData.get("isbn13"),

                front_image: formData.get("front_image"),
                back_image: formData.get("back_image")
            },
            publish_date: anyPublishDateData ? publishDateData : null,
            location: formData.get("location"),
            language: formData.get("language"),
            authors: formData.getAll("author"),
            publishers: formData.getAll("publisher"),
            subjects: formData.getAll("subject")
        }

        const bookFormParsingResult = bookFormSchema.safeParse(bookFormData)
        if (!bookFormParsingResult.success) {
            return fail(HttpErrors.BadRequest, {
                message: bookFormParsingResult.error.issues[0].message // TODO: give detailed error message
            })
        }
        const bookFormParsedData: InsertBookData = bookFormParsingResult.data


        const createBookError = await db.createBook(bookFormParsedData)
        if (createBookError) {
            return fail(HttpErrors.BadRequest, {
                message: createBookError.message
            })
        }

        throw redirect(HttpErrors.SeeOther, `/book/${bookFormParsedData.book.isbn}`)
    }
}
