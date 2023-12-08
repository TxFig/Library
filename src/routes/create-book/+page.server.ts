import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"

import db, { type InsertBookData } from "$lib/server/database/book"


export const load: PageServerLoad = async () => ({
    authors: await db.getAllAuthors(),
    publishers: await db.getAllPublishers(),
    subjects: await db.getAllSubjects(),
    locations: await db.getAllLocations(),
    languages: await db.getAllLanguages()
})

const INT32LIMIT = 2147483647 // TODO: move to db side

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()

        const isbnString = formData.get("isbn") as string | null
        const isbn = Number(isbnString)

        if (Number.isNaN(isbn) || !Number.isInteger(isbn) || isbn > INT32LIMIT) {
            return fail(400, {
                message: "Invalid ISBN"
            })
        }

        if (!isbnString) {
            return fail(400, {
                message: "Missing ISBN Parameter"
            })
        }

        const bookAlreadyExists = await db.doesBookExist(isbn)
        if (bookAlreadyExists) {
            return fail(409, {
                message: "Book already exists in database.",
            })
        }

        const frontImage = formData.get("front_image") as File | null
        const backImage = formData.get("back_image") as File | null
        const day = formData.get("publish_date:day") as string | null
        const month = formData.get("publish_date:month") as string | null
        const year = formData.get("publish_date:year") as string | null
        const publish_date = [day, month, year].filter(Boolean).join("-")

        const book: InsertBookData["book"] = {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string | null,
            number_of_pages: Number(formData.get("number_of_pages")),
            publish_date: publish_date ? new Date(publish_date) : null, // TODO: fix and extract publish date logic (error if theres only 2 options day-month, day-year, month-year)

            isbn,
            isbn10: null,
            isbn13: null,

            front_image: frontImage,
            back_image: backImage
        }

        const authors: InsertBookData["authors"] = formData.getAll("author") as string[]
        const publishers: InsertBookData["publishers"] = formData.getAll("publisher") as string[]
        const subjects: InsertBookData["subjects"] = formData.getAll("subject") as string[]
        const location: InsertBookData["location"] = formData.get("location") as string | undefined ?? null
        const language: InsertBookData["language"] = formData.get("language") as string | undefined ?? null

        const error = await db.createBook({ book, authors, publishers, subjects, location, language })
        if (error) {
            return fail(400, {
                message: error.message
            })
        }

        throw redirect(303, `/book/${book.isbn}`)
    }
}
