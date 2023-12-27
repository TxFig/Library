import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect, error, ActionFailure } from "@sveltejs/kit"

import db, { type InsertBookData } from "$lib/server/database/book"

import { ISBNSchema } from "$lib/utils/isbn"
import { bookDataSchema, publishDateSchema } from "$lib/utils/book-form"


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
            throw error(401, {
                message: "Need to be logged in"
            })
        }

        const formData = await request.formData()

        const isbnInput = formData.get("isbn")
        const isbnParsingResult = ISBNSchema.safeParse(isbnInput)
        if (!isbnParsingResult.success) {
            return fail(400, {
                message: isbnParsingResult.error.issues[0].message
            })
        }
        const isbn = isbnParsingResult.data

        const bookAlreadyExists = await db.doesBookExist(isbn)
        if (bookAlreadyExists) {
            return fail(409, {
                message: "Book already exists in database.",
            })
        }

        const bookData = {
            title: formData.get("title"),
            subtitle: formData.get("subtitle"),
            number_of_pages: formData.get("number_of_pages"),
            front_image: formData.get("front_image"),
            back_image: formData.get("back_image")
        }

        const bookDataParsingResult = bookDataSchema.safeParse(bookData)
        if (!bookDataParsingResult.success) {
            return fail(400, {
                message: bookDataParsingResult.error.issues[0].message // TODO: give detailed error message
            })
        }
        const book: InsertBookData["book"] = bookDataParsingResult.data

        const publishDateData = {
            day: formData.get("publish_date:day"),
            month: formData.get("publish_date:month"),
            year: formData.get("publish_date:year"),
        }

        let publish_date: InsertBookData["publish_date"]
        if (!(publishDateData.day && publishDateData.month && publishDateData.year))
            publish_date = null

        const publishDateParsingResult = publishDateSchema.safeParse(publishDateData)
        if (!publishDateParsingResult.success) {
            return fail(400, {
                message: "Publish Date incorrectly formatted" // TODO: give detailed error message
            })
        }
        publish_date = publishDateParsingResult.data

        const authors: InsertBookData["authors"] = formData.getAll("author") as string[]
        const publishers: InsertBookData["publishers"] = formData.getAll("publisher") as string[]
        const subjects: InsertBookData["subjects"] = formData.getAll("subject") as string[]
        const location: InsertBookData["location"] = formData.get("location") as string | undefined ?? null
        const language: InsertBookData["language"] = formData.get("language") as string | undefined ?? null

        const createBookError = await db.createBook({ book, publish_date, authors, publishers, subjects, location, language })
        if (createBookError) {
            return fail(400, {
                message: createBookError.message
            })
        }

        throw redirect(303, `/book/${book.isbn}`)
    }
}
