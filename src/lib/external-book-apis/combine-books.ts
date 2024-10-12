import { descending } from "$lib/utils/sorting"
import type { DateObjectWithYear } from "$lib/validation/book/publish-date"
import type { ExternalBookData } from "."


export function getBiggerFile(filesOrUndefined: (File | undefined)[]): File | undefined {
    const files = filesOrUndefined
        .filter((image): image is File => Boolean(image))
    if (files.length === 0) return undefined
    if (files.length === 1) return files[0]

    return files.sort((a, b) => descending(a.size, b.size))[0]
}

export function getBiggerPublishDate(datesOrUndefined: (DateObjectWithYear | undefined)[]): DateObjectWithYear | undefined {
    const dates = datesOrUndefined
        .filter((date): date is DateObjectWithYear => Boolean(date))
    if (dates.length === 0) return undefined
    if (dates.length === 1) return dates[0]

    return dates.reduce((maxObj, currentObj) => {
        const currentCount = Object.values(currentObj).filter(Boolean).length;
        const maxCount = Object.values(maxObj).filter(Boolean).length;
        return currentCount > maxCount ? currentObj : maxObj;
    })
}

export function combineBooksData(isbn: string, books: ExternalBookData[]): ExternalBookData {
    const title = books[0].title
    const subtitle = books.find(book => Boolean(book.subtitle))?.subtitle
    const number_of_pages = books.find(book => Boolean(book.number_of_pages))?.number_of_pages
    const isbn10 = books.find(book => Boolean(book.isbn10))?.isbn10
    const isbn13 = books.find(book => Boolean(book.isbn13))?.isbn13
    const image = getBiggerFile(books.map(book => book.image))
    const publish_date = getBiggerPublishDate(books.map(book => book.publish_date))
    const authors = books.map(book => book.authors).sort((a, b) => descending(a.length, b.length))[0]
    const publishers = books.map(book => book.publishers).sort((a, b) => descending(a.length, b.length))[0]
    const subjects = books.map(book => book.subjects).sort((a, b) => descending(a.length, b.length))[0]

    return {
        isbn,
        title,
        subtitle,
        number_of_pages,
        isbn10,
        isbn13,
        image,
        publish_date,
        authors,
        publishers,
        subjects,
    }
}
