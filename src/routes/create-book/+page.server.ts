import path from "path"

import type { Actions, PageServerLoad } from "./$types"
import { fail, redirect } from "@sveltejs/kit"

import db from "$lib/server/database"
import { formatImageFilename, saveFile } from "$lib/utils/images"
import { IMAGES_PATH } from "$env/static/private"

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


async function saveImage(filename: string, content: Buffer) {
    try {
        const filepath = path.join(IMAGES_PATH, filename)
        await saveFile(filepath, content)
    } catch (error) {
        throw fail(500, {
            message: "Error saving front image"
        })
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

        const bookAlreadyExists = await db.getBookByISBN(isbn)
        if (bookAlreadyExists) {
            return fail(409, {
                message: "Book already exists in database.",
            })
        }


        const frontImage = formData.get("front_image") as File | null
        let frontImageFilename: string | null = null
        if (frontImage) {
            frontImageFilename = formatImageFilename(isbn, "front", frontImage.name)
            const content = Buffer.from(await frontImage.arrayBuffer())
            await saveImage(frontImageFilename, content)
        }

        const backImage = formData.get("back_image") as File | null
        let backImageFilename: string | null = null
        if (backImage) {
            backImageFilename = formatImageFilename(isbn, "back", backImage.name)
            const content = Buffer.from(await backImage.arrayBuffer())
            await saveImage(backImageFilename, content)
        }

        const day = formData.get("publish_date:day") as string | null
        const month = formData.get("publish_date:month") as string | null
        const year = formData.get("publish_date:year") as string | null
        const publish_date = [day, month, year].filter(Boolean).join("-")

        // TODO: double check what fields are required and which aren't
        const book: InsertBook = {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string | null,
            number_of_pages: Number(formData.get("number_of_pages")),
            publish_date: publish_date,

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
