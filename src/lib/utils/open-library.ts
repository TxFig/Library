import path from "path"
import { formatImageFilename, saveFile } from "$lib/utils/images"
import { IMAGES_PATH } from "$env/static/private"

import type { InsertAuthor } from "$lib/models/Author"
import type { InsertPublisher } from "$lib/models/Publisher"
import type { InsertSubject } from "$lib/models/Subject"
import type { InsertBook, InsertBookData, OpenLibraryBookData } from "../models/Book"


const openLibraryISBN_URL = "https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:"
export async function getOpenLibraryBook(isbn: string): Promise<InsertBookData | null> {
    const url = openLibraryISBN_URL + isbn
    const response = await fetch(url)
    const json = await response.json()

    if (JSON.stringify(json) === "{}")
        return null

    return parseOpenLibraryData(isbn, json)
}

function capitalizeFirstLetter(string: string): string {
    return string[0].toUpperCase() + string.substring(1)
}

async function fetchImageContent(url: string): Promise<Buffer> {
    const res = await fetch(url)
    return Buffer.from(await res.arrayBuffer())
}

async function parseOpenLibraryData(
    isbn: string,
    json: { [isbnTag: string]: OpenLibraryBookData }
): Promise<InsertBookData> {
    const data = Object.values(json)[0]

    const authors: InsertAuthor[] = data.authors?.map(author => ({
        name: author.name
    })) ?? []

    const publishers: InsertPublisher[] = data.publishers?.map(publisher => ({
        name: publisher.name
    })) ?? []

    const subjects: InsertSubject[] = data.subjects
        ?.filter(subject => !subject.name.includes(":"))
        .map(subject => ({
            value: capitalizeFirstLetter(subject.name)
        }))
    ?? []

    const isbn13 = data.identifiers
        ? data.identifiers["isbn_13"]
            ? +data.identifiers["isbn_13"][0]
            : null
        : null

    const isbn10 = data.identifiers
        ? data.identifiers["isbn_10"]
            ? +data.identifiers["isbn_10"][0]
            : null
        : null

    const imageURL = data.cover?.large ?? data.cover?.medium ?? data.cover?.small ?? null
    const imageFilename = imageURL ? formatImageFilename(isbn, "front", imageURL) : null
    if (imageURL) {
        const imageFilepath = path.join(IMAGES_PATH, imageFilename!)
        const content = await fetchImageContent(imageURL)
        await saveFile(imageFilepath, content)
    }

    const book: InsertBook = {
        title: data.title,
        subtitle: data.subtitle ?? null,
        number_of_pages: data.number_of_pages ?? null,
        publish_date: data.publish_date ?? null,

        isbn: +isbn,
        isbn13: isbn13,
        isbn10: isbn10,

        front_image: imageFilename,
        back_image: null
    }

    return {
        book, authors, publishers, subjects,
        location: null,
        language: null
    }
}
