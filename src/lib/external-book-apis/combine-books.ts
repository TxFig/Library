import { descending } from "$lib/utils/sorting"
import type { DateObject } from "$lib/validation/book/publish-date"
import type { ExternalBookData } from "."


export function getBiggerFile(filesOrUndefined: (File | undefined)[]): File | undefined {
    const files = filesOrUndefined
        .filter((image): image is File => Boolean(image))
    if (files.length === 0) return undefined
    if (files.length === 1) return files[0]

    return files.sort((a, b) => descending(a.size, b.size))[0]
}

export function getBiggerPublishDate(datesOrUndefined: (DateObject | undefined)[]): DateObject | undefined {
    const dates = datesOrUndefined
        .filter((date): date is DateObject => Boolean(date))
    if (dates.length === 0) return undefined
    if (dates.length === 1) return dates[0]

    return dates.reduce((maxObj, currentObj) => {
        const currentCount = Object.values(currentObj).filter(Boolean).length;
        const maxCount = Object.values(maxObj).filter(Boolean).length;
        return currentCount > maxCount ? currentObj : maxObj;
    })
}

export function combineBooksData(books: ExternalBookData[]): ExternalBookData {
    const authors = books.map(book => book.authors).sort((a, b) => descending(a.length, b.length))[0]
    const subjects = books.map(book => book.subjects).sort((a, b) => descending(a.length, b.length))[0]

    const title = books[0].edition.title
    const subtitle = books.find(book => Boolean(book.edition.subtitle))?.edition.subtitle
    const pageCount = books.find(book => Boolean(book.edition.pageCount))?.edition.pageCount
    const isbn10 = books.find(book => Boolean(book.edition.isbn10))?.edition.isbn10
    const isbn13 = books.find(book => Boolean(book.edition.isbn13))?.edition.isbn13
    const image = getBiggerFile(books.map(book => book.edition.image))
    const publishDate = getBiggerPublishDate(books.map(book => book.edition.publishDate))
    const publishers = books.map(book => book.edition.publishers).sort((a, b) => descending(a.length, b.length))[0]
    const language = books.find(book => Boolean(book.edition.language))?.edition.language

    return {
        authors,
        subjects,
        edition: {
            title,
            subtitle,
            pageCount,
            isbn10,
            isbn13,
            image,
            publishDate,
            publishers,
            language
        }
    }
}
