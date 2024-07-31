export type OpenLibrarySearchResult = {
    [key: string]: OpenLibraryBookData
} | {}

export interface OpenLibraryBookData {
    url: string
    key: string

    title: string
    subtitle?: string
    number_of_pages?: number
    publish_date?: string

    authors?: Author[]
    publishers?: Publisher[]
    publish_place?: PublishPlace

    subjects?: Subject[]
    subject_places?: Subject[]
    subject_people?: Subject[]
    subject_times?: Subject[]

    identifiers?: Identifiers
    classifications?: Classifications
    notes?: string
    ebooks?: Ebook[]
    cover?: Cover
    pagination?: string
    weight?: string
    by_statement?: string
}

interface Author {
    url: string
    name: string
}

interface Publisher {
    name: string
}

export interface PublishPlace {
    name: string
}

interface Subject {
    name: string
    url: string
}

interface Identifiers {
    openlibrary: string[]
    isbn_13?: string[]
    isbn_10?: string[]
    lccn?: string[]
    oclc?: string[]
    goodreads?: string[]
    librarything?: string[]
}

interface Classifications {
    lc_classifications: string[]
    dewey_decimal_class?: string[]
}

interface Ebook {
    preview_url: string
    availability: string
    formats: {}
    borrow_url?: string
    checkedout?: boolean
}

export interface Cover {
    small: string
    medium: string
    large: string
}
