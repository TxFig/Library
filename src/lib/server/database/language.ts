import { db } from "."
import type Book from "$lib/models/Book"
import type Language from "$lib/models/Language"


export async function getAllLanguages(): Promise<Language[]> {
    return await db.all<Language[]>("SELECT * FROM Languages")
}

export async function getLanguageByBook(book: Book): Promise<Language | null> {
    return await db.get<Language>(
        `SELECT * FROM Languages
        WHERE id = ?`,
        [book.language_id]
    ) ?? null
}
