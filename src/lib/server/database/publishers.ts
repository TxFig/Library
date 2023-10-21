import { db } from "."
import type Book from "$lib/models/Book"
import type Publisher from "$lib/models/Publisher"


export async function getAllPublishers(): Promise<Publisher[]> {
    return await db.all<Publisher[]>("SELECT * FROM Publishers")
}

export async function getPublisherByName(name: string): Promise<Publisher | null> {
    return await db.get<Publisher>(
        "SELECT * FROM Publishers WHERE name = ?",
        [name]
    ) ?? null
}

export async function getPublishersByBook(book: Book): Promise<Publisher[]> {
    return await db.all<Publisher[]>(`
        SELECT Publishers.*
        FROM BooksPublishers
        INNER JOIN Publishers ON Publishers.id = BooksPublishers.publisher_id
        WHERE BooksPublishers.book_id = ?
    `, [book.id])
}
