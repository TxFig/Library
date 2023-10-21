import type { InsertAuthor } from "./Author"
import type { InsertLanguage } from "./Language"
import type { InsertLocation } from "./Location"
import type { InsertPublisher } from "./Publisher"
import type { InsertSubject } from "./Subject"


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

export interface Book {
    id: number

    title: string
    subtitle: string | null
    number_of_pages: number | null
    publish_date: string | null

    isbn: number
    isbn10: number | null
    isbn13: number | null

    front_image: string | null
    back_image: string | null

    location_id: number | null
    language_id: number | null
}

export type InsertBook = Omit<Book, "id" | "location_id" | "language_id">

export type InsertBookData = {
    book: InsertBook
    authors: InsertAuthor[]
    publishers: InsertPublisher[]
    subjects: InsertSubject[],
    location: InsertLocation | null,
    language: InsertLanguage | null
}

export default Book
