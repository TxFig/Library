import { db } from "."
import type Author from "$lib/models/Author"
import type Book from "$lib/models/Book"


export async function getAllAuthors(): Promise<Author[]> {
    return await db.all<Author[]>("SELECT * FROM Authors")
}

export async function getAuthorByName(name: string): Promise<Author | null> {
    return await db.get<Author>(
        "SELECT * FROM Authors WHERE name = ?",
        [name]
    ) ?? null
}

export async function getAuthorsByBook(book: Book): Promise<Author[]> {
    return await db.all<Author[]>(`
        SELECT Authors.*
        FROM BooksAuthors
        INNER JOIN Authors ON Authors.id = BooksAuthors.author_id
        WHERE BooksAuthors.book_id = ?
    `, [book.id])
}
