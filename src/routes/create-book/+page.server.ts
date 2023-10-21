import type { Actions, PageServerLoad } from "./$types"
import db from "$lib/server/database"
import { fail, redirect } from "@sveltejs/kit"

import path from "path"
import fs from "fs"
import type { InsertBook } from "$lib/models/Book"
import type { InsertAuthor } from "$lib/models/Author"
import type { InsertPublisher } from "$lib/models/Publisher"
import type { InsertSubject } from "$lib/models/Subject"
import type { InsertLocation } from "$lib/models/Location"
import type { InsertLanguage } from "$lib/models/Language"


export const load: PageServerLoad = async () => ({
    authors: await db.getAllAuthors(),
    publishers: await db.getAllPublishers(),
    subjects: await db.getAllSubjects(),
    locations: await db.getAllLocations(),
    languages: await db.getAllLanguages()
})


function saveImage(filename: string, content: Buffer) {
    fs.writeFile(path.join("static", filename), content, (err) => {
            if (err) {
                console.error(err)
                throw fail(500, {
                    message: "Error saving front image"
                })
            }
        }
    )
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

        const bookAlreadyExists = await db.getBookByISBN(isbn)
        if (bookAlreadyExists) {
            return fail(409, {
                message: "Book already exists in database.",
            })
        }


        const frontImage = formData.get("front_image") as File | null
        let frontImageFilename: string | null = null
        if (frontImage) {
            const ext = frontImage.name.split(".").pop()
            frontImageFilename = `/images/${isbn}-front.${ext}`
            const content = Buffer.from(await frontImage.arrayBuffer())
            saveImage(frontImageFilename, content)
        }

        const backImage = formData.get("back_image") as File | null
        let backImageFilename: string | null = null
        if (backImage) {
            const ext = backImage.name.split(".").pop()
            backImageFilename =  `/images/${isbn}-back.${ext}`
            const content = Buffer.from(await backImage.arrayBuffer())
            saveImage(backImageFilename, content)
        }

        // TODO: double check what fields are required and which aren't
        const book: InsertBook = {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string | null,
            number_of_pages: Number(formData.get("number_of_pages")),
            publish_date: formData.get("publish_date") as string | null,

            isbn: Number(isbn),
            isbn10: null,
            isbn13: null,

            front_image: frontImageFilename,
            back_image: backImageFilename
        }

        const formAuthors = formData.getAll("author") as string[]
        const authors: InsertAuthor[] = formAuthors.map(author => ({ name: author }))

        const formPublishers = formData.getAll("publisher") as string[]
        const publishers: InsertPublisher[] = formPublishers.map(publisher => ({ name: publisher }))

        const formSubjects = formData.getAll("subject") as string[]
        const subjects: InsertSubject[] = formSubjects.map(subject => ({ value: subject }))

        const formLocation = formData.get("location") as string | undefined
        const location: InsertLocation | null = formLocation
            ? { value: formLocation }
            : null

        const formLanguage = formData.get("language") as string | undefined
        const language: InsertLanguage | null = formLanguage
            ? { value: formLanguage }
            : null

        db.insertBookInfo({ book, authors, publishers, subjects, location, language })
        throw redirect(303, `/book/${book.isbn}`)
    }
}
