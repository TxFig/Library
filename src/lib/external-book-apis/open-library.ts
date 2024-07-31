import fetchImageAsFile from "$lib/utils/fetch-image-as-file";
import { isObjectNotEmpty } from "$lib/utils/is-object-empty";
import type { BookCreateFormData } from "$lib/validation/book/book-form";
import type { DateObjectWithYear } from "$lib/validation/book/publish-date";
import type { Cover, OpenLibraryBookData, OpenLibrarySearchResult } from "./open-library-types";


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

function capitalizeFirstLetter(string: string): string {
    return string[0].toUpperCase() + string.substring(1)
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

export async function parseOpenLibraryBookData(isbn: string, book: OpenLibraryBookData): Promise<BookCreateFormData> {

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
    const subjects = book.subjects
        ?.filter(subject => !subject.name.includes(":"))
        .map(subject => capitalizeFirstLetter(subject.name))
        ?? []

    return {
        isbn,
        title: book.title,
        subtitle: book.subtitle,
        publish_date,
        isbn10,
        isbn13,
        image,
        authors,
        publishers,
        subjects,
        public: true,
    }
}
