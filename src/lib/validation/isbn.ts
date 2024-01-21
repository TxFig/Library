import { z } from "zod"


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
