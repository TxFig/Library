import * as v from "valibot"


export const formISBNRegex = /^[0-9X]*$/
const allSpacesAndHyphensRegex = /[-\s]/g
const ISBNFormatRegex = /^(?:[0-9]{9}[0-9X]|978[0-9]{10})$/

export function formatISBN(isbn: string): string {
    return isbn.replace(allSpacesAndHyphensRegex, "")
}

export function validateISBN(isbn: string): boolean {
    isbn = formatISBN(isbn)
    if (!ISBNFormatRegex.test(isbn)) return false

    if (isbn.length === 10)
        return validateISBN10(isbn)
    else if (isbn.length === 13)
        return validateISBN13(isbn)

    return false
}

function validateISBN10(isbn: string): boolean {
    let sum = 0
    for (let index = 0; index < isbn.length; index++) {
        const number = isbn[index] === "X" ? 10 : Number(isbn[index])
        sum += number * (index + 1)
    }

    return sum % 11 === 0
}

function validateISBN13(isbn: string): boolean {
    let sum = 0
    for (let index = 0; index < isbn.length; index++) {
        const number = Number(isbn[index])
        const weight = index % 2 === 0 ? 1 : 3
        sum += number * weight
    }

    return sum % 10 === 0
}

export const ISBNSchema = v.pipe(
    v.string(),
    v.minLength(1, "ISBN Required"),
    v.check(validateISBN, "Invalid ISBN"),
    v.transform(value => value.replace(allSpacesAndHyphensRegex, ""))
)
