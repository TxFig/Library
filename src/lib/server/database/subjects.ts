import { db } from "."
import type Book from "$lib/models/Book"
import type Subject from "$lib/models/Subject"


export async function getAllSubjects(): Promise<Subject[]> {
    return await db.all<Subject[]>("SELECT * FROM Subjects")
}

export async function getSubjectsByBook(book: Book): Promise<Subject[]> {
    return await db.all<Subject[]>(`
        SELECT Subjects.*
        FROM BooksSubjects
        INNER JOIN Subjects ON Subjects.id = BooksSubjects.subject_id
        WHERE BooksSubjects.book_id = ?
    `, [book.id])
}
