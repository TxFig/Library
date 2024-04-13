import type { BookCreateDataWithImageFiles } from "$lib/validation/book-form"
import type { DateObjectWithYear } from "$lib/validation/publish-date"


export interface OpenLibraryBookData {
    url: string
    key: string // e.g. "/books/OL9181038M"
    title: string
    subtitle?: string
    authors?: { url: string; name: string }[]
    number_of_pages?: number
    identifiers?: { [key: string]: string[] } // e.g. { "isbn_13": ["01234567890123"] }
    classifications?: { [key: string]: string[] }[] // ?
    publishers?: { name: string }[] // e.g. { "name": "O'Reilly Media" }
    publish_date?: string // e,g, "March 31, 1999" | "2019"
    subjects?: { name: string; url: string }[] // e.g. { "name": "Mathematics", "url": "https://openlibrary.org/subjects/mathematics" }
    subject_places?: { name: string; url: string }[] // e.g. { "name": "Portugal", "url": "https://openlibrary.org/subjects/place:portugal" }
    subject_people?: { name: string; url: string }[] // e.g. { "name": "Eça de Queirós (1845-1900)", "url": "https://openlibrary.org/subjects/person:eça_de_queirós_(1845-1900)" }
    subject_times?: { name: string; url: string }[] // e.g. { "name": "Século XIX", "url": "https://openlibrary.org/subjects/time:século_xix" }
    notes?: string // e.g. "Source title: JavaScript: The Definitive Guide: Master the World's Most-Used Programming Language"
    links?: { title: string; url: string }[]
    ebooks?: {
        preview_url: string
        availability: string
        formats: {}
        borrow_url: string
        checkedout: boolean
    }[] // ?
    cover?: {
        small?: string
        medium?: string
        large?: string
    }
}

const openLibraryISBN_URL = "https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:"
export async function getOpenLibraryBook(isbn: string): Promise<BookCreateDataWithImageFiles | null> {
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

async function fetchImageContent(url: string): Promise<File> {
    const res = await fetch(url)
    const arrayBuffer = await res.arrayBuffer()
    return new File([arrayBuffer], "")
}

function openLibraryDateToDateObject(date: string): DateObjectWithYear {
    const dateJsObject = new Date(date)
    return {
        year: dateJsObject.getFullYear(),
        month: dateJsObject.getMonth(),
        day: dateJsObject.getDate()
    }
}

async function parseOpenLibraryData(
    isbn: string,
    json: { [isbnTag: string]: OpenLibraryBookData }
): Promise<BookCreateDataWithImageFiles> {
    const data = Object.values(json)[0]

    const authors = data.authors?.map(author => author.name) ?? []
    const publishers = data.publishers?.map(publisher => publisher.name) ?? []

    const subjects = data.subjects
        ?.filter(subject => !subject.name.includes(":"))
        .map(subject => capitalizeFirstLetter(subject.name))
        ?? []

    const isbn13 = data.identifiers
        ? data.identifiers["isbn_13"]
            ? BigInt(data.identifiers["isbn_13"][0])
            : null
        : null

    const isbn10 = data.identifiers
        ? data.identifiers["isbn_10"]
            ? BigInt(data.identifiers["isbn_10"][0])
            : null
        : null

    const imageURL = data.cover?.large ?? data.cover?.medium ?? data.cover?.small ?? null
    const imageFile = imageURL ? await fetchImageContent(imageURL) : null

    const publishDate = data.publish_date ?
        openLibraryDateToDateObject(data.publish_date)
    : null

    return {
        title: data.title,
        subtitle: data.subtitle ?? null,
        number_of_pages: data.number_of_pages ?? null,
        publish_date: publishDate,

        isbn: BigInt(isbn),
        isbn13: isbn13,
        isbn10: isbn10,

        front_image: imageFile,
        back_image: null,

        authors,
        publishers,
        subjects,
        location: null,
        language: null
    }
}
