import fetchImageAsFile from "$lib/utils/fetch-image-as-file";
import type { DateObjectWithYear } from "$lib/validation/book/publish-date";
import type { ExternalBookData } from ".";
import type { GoogleBooksBookData, GoogleBooksSearchResult, ImageLinks } from "./google-books-types";



export async function getParsedGoogleBooksBook(isbn: string): Promise<ExternalBookData | null> {
    const book = await getGoogleBooksBook(isbn)
    if (!book) return null

    return await parseGoogleBookBookData(isbn, book)
}

const generateFetchUrl =
    (isbn: string) => `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`

export async function getGoogleBooksBook(isbn: string): Promise<GoogleBooksBookData | null> {
    const url = generateFetchUrl(isbn)
    const response = await fetch(url)
    if (!response.ok) return null
    const json: GoogleBooksSearchResult = await response.json()

    if (json.totalItems === 0) {
        return null
    }

    return json.items[0]
}

function parseGoogleBooksDate(date: string): DateObjectWithYear | undefined {
    const [year, month, day] = date.split("-")

    return {
        year: Number(year),
        month: month ? Number(month) : undefined,
        day: day ? Number(day) : undefined,
    }
}

async function fetchCoverImage(imageLinks: ImageLinks): Promise<File | undefined> {
    const thumbnail = await fetchImageAsFile(imageLinks.thumbnail)
    if (thumbnail) return thumbnail
    const smallThumbnail = await fetchImageAsFile(imageLinks.smallThumbnail)
    if (smallThumbnail) return smallThumbnail
    return undefined
}

export async function parseGoogleBookBookData(isbn: string, book: GoogleBooksBookData): Promise<ExternalBookData> {
    const publish_date = book.volumeInfo.publishedDate ?
        parseGoogleBooksDate(book.volumeInfo.publishedDate)
    : undefined

    const isbn10 = book.volumeInfo.industryIdentifiers.find(
        (identifier) => identifier.type === "ISBN_10"
    )?.identifier
    const isbn13 = book.volumeInfo.industryIdentifiers.find(
        (identifier) => identifier.type === "ISBN_13"
    )?.identifier

    const image = book.volumeInfo.imageLinks ?
        await fetchCoverImage(book.volumeInfo.imageLinks)
    : undefined

    const authors = book.volumeInfo.authors ?? []
    const publishers = book.volumeInfo.publisher ?
        [book.volumeInfo.publisher]
    : []
    const subjects = book.volumeInfo.categories ?? []

    return {
        isbn,
        title: book.volumeInfo.title,
        subtitle: book.volumeInfo.subtitle,
        number_of_pages: book.volumeInfo.pageCount,
        publish_date,
        isbn10,
        isbn13,
        image,
        authors,
        publishers,
        subjects,
    }
}
