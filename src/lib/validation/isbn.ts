import { z } from "zod"
import { HttpError } from "$lib/utils/custom-errors"
import HttpCodes from "$lib/utils/http-codes"
import { getFormattedError } from "./format-errors"


const allSpacesAndHyphensRegex = /[-\s]/g
const ISBNFormatRegex = /^(?:[0-9X]{10}|[0-9]{13})$/

export function validateISBN(isbn: string): boolean {
    isbn = isbn.replace(allSpacesAndHyphensRegex, "")
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


export const ISBNSchema = z
    .string()
    .min(1)
    .refine(validateISBN, "Invalid ISBN")
    .transform(value => BigInt(value))

export const ISBNOptionalSchema = ISBNSchema
    .nullish()


export function parseISBN(isbn: unknown): bigint {
    const parsingResult = ISBNSchema.safeParse(isbn)
    if (!parsingResult.success) {
        throw new HttpError(
            HttpCodes.ClientError.BadRequest,
            parsingResult.error.errors[0]
        )
    }

    return parsingResult.data
}

export function parseOptionalISBN(isbn: unknown): bigint | null | undefined {
    const parsingResult = ISBNOptionalSchema.safeParse(isbn)
    if (!parsingResult.success) {
        throw new HttpError(
            HttpCodes.ClientError.BadRequest,
            parsingResult.error.errors[0]
        )
    }

    return parsingResult.data
}
