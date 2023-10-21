import { db } from "."
import type Book from "$lib/models/Book"
import type Author from "$lib/models/Author"
import type Publisher from "$lib/models/Publisher"


export async function getAllBooks(): Promise<Book[]> {
    return await db.all<Book[]>("SELECT * FROM Books")
}

export async function getBookByISBN(isbn: string): Promise<Book | null> {
    return await db.get<Book>(
        "SELECT * FROM Books WHERE isbn = ? OR isbn10 = ? OR isbn13 = ?",
        [isbn, isbn, isbn]
    ) ?? null
}

export async function getBooksByAuthor(author: Author): Promise<Book[]> {
    return await db.all<Book[]>(`
        SELECT Books.*
        FROM BooksAuthors
        INNER JOIN Books ON Books.id = BooksAuthors.book_id
        WHERE BooksAuthors.author_id = ?
    `, [author.id])
}

export async function getBooksByPublisher(publisher: Publisher): Promise<Book[]> {
    return await db.all<Book[]>(`
        SELECT Books.*
        FROM BooksPublishers
        INNER JOIN Books ON Books.id = BooksPublishers.book_id
        WHERE BooksPublishers.publisher_id = ?
    `, [publisher.id])
}

/**
 * Updates a row in the Books' table where id = `book.id`
 */
export async function updateBook(book: Book): Promise<void> {
    await db.run(`UPDATE Books SET
        title = ?, subtitle = ?, number_of_pages = ?, publish_date = ?,
        isbn = ?, isbn10 = ?, isbn13 = ?,
        front_image = ?, back_image = ?,
        location_id = ?, language_id = ? WHERE id = ?
    `, [
        book.title,
        book.subtitle,
        book.number_of_pages,
        book.publish_date,
        book.isbn,
        book.isbn10,
        book.isbn13,

        book.front_image,
        book.back_image,

        book.location_id,
        book.language_id,

        book.id
    ])
}
