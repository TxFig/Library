import type { Actions, PageServerLoad } from "./$types"
import { error, fail, redirect } from "@sveltejs/kit"

import db, { type InsertBookData } from "$lib/server/database/book"



export const load: PageServerLoad = async ({ params }) => {
    const { isbn: isbnString } = params

    const isbn = Number(isbnString) // TODO: validation (not nan, integer, inside 32int limit)
    const book = await db.getEntireBookByISBN(isbn)

    if (!book) {
        throw error(404, {
            message: "Book Not Available"
        })
    }

    return {
        book,
        allAuthors: await db.getAllAuthors(),
        allPublishers: await db.getAllPublishers(),
        allSubjects: await db.getAllSubjects(),
        allLocations: await db.getAllLocations(),
        allLanguages: await db.getAllLanguages()
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData()

        const isbn = formData.get("isbn") as string | null

        if (!isbn) {
            return fail(400, {
                message: "Missing ISBN Parameter"
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
            publish_date: publish_date ? new Date(publish_date) : null,

            isbn: Number(isbn),
            isbn10: null, // TODO: fix: always overwrites previous values (from OpenLibrary)
            isbn13: null, // TODO: ^^^

            front_image: frontImage,
            back_image: backImage
        }

        const authors: InsertBookData["authors"] = formData.getAll("author") as string[]
        const publishers: InsertBookData["publishers"] = formData.getAll("publisher") as string[]
        const subjects: InsertBookData["subjects"] = formData.getAll("subject") as string[]
        const location: InsertBookData["location"] = formData.get("location") as string | undefined ?? null
        const language: InsertBookData["language"] = formData.get("language") as string | undefined ?? null

        await db.updateBook({ book, authors, publishers, subjects, location, language })
        throw redirect(303, `/book/${book.isbn}`)
    }
}
