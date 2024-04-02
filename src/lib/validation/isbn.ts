import { z } from "zod"
import { HttpError } from "$lib/utils/custom-errors"
import HttpCodes from "$lib/utils/http-codes"
import { getFormattedError } from "./format-errors"


export function validateISBN(isbn: string): boolean {
    if (isbn.length != 10 && isbn.length != 13) return false

    // ISBN-10 validation
    if (isbn.length === 10) {
        let sum = 0
        for (let i = 0; i < 9; i++) {
            const digit = parseInt(isbn[i])
            if (isNaN(digit)) return false
            sum += digit * (10 - i)
        }
        let checkDigit = 10 - (sum % 10)
        let lastChar = isbn[9].toUpperCase()
        return checkDigit === 10 ? lastChar === 'X' : parseInt(lastChar) === checkDigit
    }

    // ISBN-13 validation
    else if (isbn.length === 13) {
        let sum = 0
        for (let i = 0; i < 12; i++) {
            const digit = parseInt(isbn[i])
            if (isNaN(digit)) return false
            sum += digit * (i % 2 === 0 ? 1 : 3)
        }
        const checkDigit = 10 - (sum % 10)
        const lastDigit = parseInt(isbn[12])
        return lastDigit === (checkDigit === 10 ? 0 : checkDigit)
    }

    return false
}


export const ISBNSchema = z
    .string()
    .refine(validateISBN, "Invalid ISBN")
    .transform(value => BigInt(value))

export const ISBNOptionalSchema = ISBNSchema
    .nullish()

export function parseISBN(isbn: unknown): bigint {
    const parsingResult = ISBNSchema.safeParse(isbn)
    if (!parsingResult.success) {
        throw new HttpError(
            HttpCodes.ClientError.BadRequest,
            getFormattedError(parsingResult.error) //? Why use this?
        )
    }

    return parsingResult.data
}

export function parseOptionalISBN(isbn: unknown): bigint | null | undefined {
    const parsingResult = ISBNOptionalSchema.safeParse(isbn)
    if (!parsingResult.success) {
        throw new HttpError(
            HttpCodes.ClientError.BadRequest,
            getFormattedError(parsingResult.error) //? Why use this?
        )
    }

    return parsingResult.data
}
