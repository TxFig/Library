import type { BookCreateFormData } from "$lib/validation/book/book-form"
import type { DateObjectWithYear } from "$lib/validation/book/publish-date"
import fetchImageAsFile from "./fetch-image-as-file"


export interface OpenLibraryBookData {
    url: string
    key: string // e.g. "/books/OL9181038M"
    title: string
    subtitle?: string
    authors?: { url: string; name: string }[]
    number_of_pages?: number
    identifiers?: { [key: string]: string[] } // e.g. { "isbn_13": ["01234567890123"] }
    classifications?: { [key: string]: string[] }
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
    }[]
    cover?: {
        small?: string
        medium?: string
        large?: string
    }
}

const openLibraryISBN_URL = "https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:"
export async function getOpenLibraryBook(isbn: string): Promise<BookCreateFormData | null> {
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

const openLibraryPublishDateRegex = /^(?:(January|February|March|April|May|June|July|August|September|October|November|December)?(?:\s+(\d{1,2}))?(?:,?\s*)?(\d{4}))$/
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
function openLibraryDateToDateObject(date: string): DateObjectWithYear | undefined {
    const match = date.match(openLibraryPublishDateRegex)
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

async function parseOpenLibraryData(
    isbn: string,
    json: { [isbnTag: string]: OpenLibraryBookData }
): Promise<BookCreateFormData> {
    const data = Object.values(json)[0]

    const authors = data.authors?.map(author => author.name) ?? []
    const publishers = data.publishers?.map(publisher => publisher.name) ?? []

    const subjects = data.subjects
        ?.filter(subject => !subject.name.includes(":"))
        .map(subject => capitalizeFirstLetter(subject.name))
        ?? []

    const isbn13 = data.identifiers
        ? data.identifiers["isbn_13"]
            ? data.identifiers["isbn_13"][0]
            : null
        : null

    const isbn10 = data.identifiers
        ? data.identifiers["isbn_10"]
            ? data.identifiers["isbn_10"][0]
            : null
        : null

    const imageURL = data.cover?.large ?? data.cover?.medium ?? data.cover?.small ?? null
    const imageFile = imageURL ? await fetchImageAsFile(imageURL) ?? undefined : undefined

    const publishDate = data.publish_date ?
        openLibraryDateToDateObject(data.publish_date)
    : undefined

    return {
        title: data.title,
        subtitle: data.subtitle ?? undefined,
        number_of_pages: data.number_of_pages ?? undefined,
        publish_date: publishDate,

        isbn: isbn,
        isbn13: isbn13,
        isbn10: isbn10,

        image: imageFile,

        authors,
        publishers,
        subjects,
        location: undefined,
        language: undefined,
        public: true
    }
}
