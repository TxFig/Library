import fetchImageAsFile from "$lib/utils/fetch-image-as-file";
import { isObjectNotEmpty } from "$lib/utils/is-object-empty";
import type { DateObjectWithYear } from "$lib/validation/book/publish-date";
import type { ExternalBookData } from ".";
import type { Cover, OpenLibraryBookData, OpenLibrarySearchResult } from "./open-library-types";


export async function getParsedOpenLibraryBook(isbn: string): Promise<ExternalBookData | null> {
    const book = await getOpenLibraryBook(isbn)
    if (!book) return null

    return await parseOpenLibraryBookData(isbn, book)
}

const generateFetchUrl =
    (isbn: string) => `https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:${isbn}`

export async function getOpenLibraryBook(isbn: string): Promise<OpenLibraryBookData | null> {
    const url = generateFetchUrl(isbn)
    const response = await fetch(url)
    if (!response.ok) return null
    const json: OpenLibrarySearchResult = await response.json()

    if (!isObjectNotEmpty(json)) {
        return null
    }

    return Object.values(json)[0]
}

async function fetchCoverImage(cover: Cover): Promise<File | undefined> {
    const largeCover = await fetchImageAsFile(cover.large)
    if (largeCover) return largeCover
    const mediumCover = await fetchImageAsFile(cover.medium)
    if (mediumCover) return mediumCover
    const smallCover = await fetchImageAsFile(cover.small)
    if (smallCover) return smallCover
    return undefined
}

const PublishDateRegex = /^(?:(January|February|March|April|May|June|July|August|September|October|November|December)?(?:\s+(\d{1,2}))?(?:,?\s*)?(\d{4}))$/
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
function parseOpenLibraryDate(date: string): DateObjectWithYear | undefined {
    const match = date.match(PublishDateRegex)
    if (!match) return undefined

    const [_, month, day, year] = match
    const dateObj: DateObjectWithYear = {
        year: Number(year),
        month: undefined,
        day: undefined
    }

    if (month)
        dateObj.month = months.indexOf(month) + 1

    if (day)
        dateObj.day = Number(day)

    return dateObj
}

export async function parseOpenLibraryBookData(isbn: string, book: OpenLibraryBookData): Promise<ExternalBookData> {
    const publish_date = book.publish_date ?
        parseOpenLibraryDate(book.publish_date)
    : undefined

    const isbn10 = book.identifiers?.isbn_10 ?
        book.identifiers.isbn_10[0]
    : undefined

    const isbn13 = book.identifiers?.isbn_13 ?
        book.identifiers.isbn_13[0]
    : undefined

    const image = book.cover ?
        await fetchCoverImage(book.cover)
    : undefined

    const authors = book.authors?.map(author => author.name) ?? []
    const publishers = book.publishers?.map(publisher => publisher.name) ?? []
    const subjects = book.subjects?.map(publisher => publisher.name) ?? []

    return {
        isbn,
        title: book.title,
        subtitle: book.subtitle,
        number_of_pages: book.number_of_pages,
        publish_date,
        isbn10,
        isbn13,
        image,
        authors,
        publishers,
        subjects,
    }
}
