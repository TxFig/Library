import * as sqlite from "sqlite"
import sqlite3 from "sqlite3"
import fs from "fs"
import path from "path"

import { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByPublisher, updateBook } from "./book"
import { getAllAuthors, getAuthorByName, getAuthorsByBook } from "./authors"
import { getAllPublishers, getPublisherByName, getPublishersByBook } from "./publishers"
import { getAllSubjects, getSubjectsByBook } from "./subjects"
import { getAllLocations, getLocationByBook } from "./location"
import { getAllLanguages, getLanguageByBook } from "./language"

import type { Book, InsertBookData } from "$lib/models/Book"
import type { Author, BooksAuthors } from "$lib/models/Author"
import type { Publisher, BooksPublishers } from "$lib/models/Publisher"
import type { Subject, BooksSubjects } from "$lib/models/Subject"
import type Location from "$lib/models/Location"
import type Language from "$lib/models/Language"

import { DATABASE_PATH, IMAGES_PATH } from "$env/static/private"


export const db = await sqlite.open({
    filename: DATABASE_PATH,
    driver: sqlite3.Database
})

import createTablesSQL from "#/database/create-tables.sql?raw"
await db.exec(createTablesSQL)

type Table = {
    Book: Book
    Authors: Author
    Publishers: Publisher
    Subjects: Subject
    Locations: Location
    Languages: Language
}
type LinkingTable = {
    Authors: BooksAuthors,
    Publishers: BooksPublishers,
    Subjects: BooksSubjects,
}

const linkingTableRelations = {
    Authors   : { table: "BooksAuthors"   , otherId: "author_id"    },
    Publishers: { table: "BooksPublishers", otherId: "publisher_id" },
    Subjects  : { table: "BooksSubjects"  , otherId: "subject_id"   }
} as const

const oneToManyBookColumns = {
    Locations: "location_id",
    Languages: "language_id"
} as const
type OneToManyTable = keyof typeof oneToManyBookColumns

async function insertPropertyOrGetId<
    TK extends keyof Table,
    C extends keyof Table[TK]
>(
    table: TK,
    column: C,
    value: Table[TK][C]
): Promise<number> {
    await db.run(`INSERT OR IGNORE INTO ${table as string} (${column as string}) VALUES (?)`, [value])
    const result = await db.get<{ id: number }>(
        `SELECT id FROM ${table as string} WHERE ${column as string} = ?`,
        [value]
    )

    return result!.id
}

async function insertToLinkingTable<
    T extends keyof LinkingTable,
>(
    table: T,
    bookId: number,
    otherId: number
): Promise<void> {
    const { table: linkingTable, otherId: otherIdString } = linkingTableRelations[table]
    await db.run(`
        INSERT OR IGNORE INTO ${linkingTable} (book_id, ${otherIdString})
        VALUES (?, ?)`,
        [bookId, otherId]
    )
}

async function updateManyToManyRelation<TK extends keyof LinkingTable, T extends Table[TK]>(
    table: TK,
    oldProperties: T[],
    newProperties: Omit<T, "id">[],
    compareColumn: keyof Omit<T, "id">,
    bookId: number
): Promise<void> {
    // New properties that need to be inserted
    // (exclude old properties from new properties)
    const propertiesForInsert = newProperties.filter(
        newProperty => !oldProperties.some(
            oldProperty => oldProperty[compareColumn] == newProperty[compareColumn]
        )
    )

    // Old properties that need to be removed
    // (exclude new properties from old properties)
    const propertiesForRemoval = oldProperties.filter(
        oldProperty => !newProperties.some(
            newProperty => newProperty[compareColumn] == oldProperty[compareColumn]
        )
    )

    // Insert book-property relations for the new properties
    for (const newProperty of propertiesForInsert) {
        const otherId = await insertPropertyOrGetId(
            table,
        compareColumn as keyof Table[TK],
        newProperty[compareColumn] as Table[TK][keyof Table[TK]]
        )
        await insertToLinkingTable(table, bookId, otherId)
    }

    // Delete all relations between the book and removed properties
    // And Delete the property is it doesn't have any other books
    const { table: linkingTable, otherId } = linkingTableRelations[table]
    for (const property of propertiesForRemoval) {
        await db.run(
            `DELETE FROM ${linkingTable} WHERE book_id = ? AND ${otherId} = ?`,
            [bookId, property.id]
        )

        const remainingRelations = await db.all<LinkingTable[TK][]>(`
            SELECT * FROM ${linkingTable}
            WHERE ${otherId} = ?
        `, [property.id])
        if (remainingRelations.length == 0) {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [property.id])
        }
    }
}

async function deleteManyToManyRelation<T extends keyof LinkingTable>(table: T, bookId: number): Promise<void> {
    const { table: linkingTable, otherId } = linkingTableRelations[table]

    const relations = await db.all<LinkingTable[T][]>(
        `SELECT * FROM ${linkingTable} WHERE book_id = ?`,
        [bookId]
    )

    for (const rel of relations) {
        const other_id = rel[otherId as keyof LinkingTable[T]]
        db.run(`DELETE FROM ${linkingTable} WHERE book_id = ? AND ${otherId} = ?`, [bookId, other_id])

        const remainingRelations = await db.all<LinkingTable[T][]>(`
            SELECT * FROM ${linkingTable}
            WHERE ${otherId} = ?
        `, [other_id])
        if (remainingRelations.length == 0) {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [other_id])
        }
    }
}

async function deleteOneToManyRelation(table: OneToManyTable, id: number | null | undefined): Promise<void> {
    if (!id) return

    const column = oneToManyBookColumns[table]
    const booksWithThisProperty = await db.all<Book[]>(`SELECT * FROM Books WHERE ${column} = ?`, id)

    if (booksWithThisProperty.length == 0) {
        db.run(`DELETE FROM ${table} WHERE id = ?`, [id])
    }
}


export async function insertBookInfo({ book, authors, publishers, subjects, location, language }: InsertBookData): Promise<void> {
    const locationId = location ? await insertPropertyOrGetId("Locations", "value", location.value) : null
    const languageId = language ? await insertPropertyOrGetId("Languages", "value", language.value) : null

    const { lastID: bookId } = await db.run(`
        INSERT INTO Books (
            title, subtitle, number_of_pages, publish_date, isbn, isbn10, isbn13,
            front_image, back_image,
            location_id, language_id
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?,
            ?, ?
        )`, [
            book.title,
            book.subtitle,
            book.number_of_pages,
            book.publish_date,
            book.isbn,
            book.isbn10,
            book.isbn13,

            book.front_image,
            book.back_image,

            locationId,
            languageId
        ]
    )

    if (!bookId) { //? program crashes before this (add try/catch blocks in db.run() (use better-sqlite3))
        return
    }

    for (const author of authors) {
        const authorId = await insertPropertyOrGetId("Authors", "name", author.name)
        await insertToLinkingTable("Authors", bookId, authorId)
    }

    for (const publisher of publishers) {
        const publisherId = await insertPropertyOrGetId("Publishers", "name", publisher.name)
        await insertToLinkingTable("Publishers", bookId, publisherId)
    }

    for (const subject of subjects) {
        const subjectId = await insertPropertyOrGetId("Subjects", "value", subject.value)
        await insertToLinkingTable("Subjects", bookId, subjectId)
    }
}

export async function updateBookInfo({ book, authors, publishers, subjects, location, language }: InsertBookData): Promise<void> {
    const oldBook = await getBookByISBN(book.isbn.toString())
    if (!oldBook) return

    const locationId = location ? await insertPropertyOrGetId("Locations", "value", location.value) : null
    const languageId = language ? await insertPropertyOrGetId("Languages", "value", language.value) : null

    await updateBook({
        id: oldBook.id,

        title: book.title,
        subtitle: book.subtitle,
        number_of_pages: book.number_of_pages,
        publish_date: book.publish_date,
        isbn: book.isbn,
        isbn10: book.isbn10,
        isbn13: book.isbn13,

        front_image: book.front_image ?? oldBook.front_image,
        back_image: book.back_image ?? oldBook.back_image,

        location_id: locationId,
        language_id: languageId,
    })

    const oldAuthors = await getAuthorsByBook(oldBook)
    updateManyToManyRelation("Authors", oldAuthors, authors, "name", oldBook.id)
    const oldPublishers = await getPublishersByBook(oldBook)
    updateManyToManyRelation("Publishers", oldPublishers, publishers, "name", oldBook.id)
    const oldSubjects = await getSubjectsByBook(oldBook)
    updateManyToManyRelation("Subjects", oldSubjects, subjects, "value", oldBook.id)
}

export async function deleteBookInfo(isbn: string) {
    const book = await getBookByISBN(isbn)
    if (!book) return

    if (book.front_image) {
        fs.unlink(path.join(IMAGES_PATH, book.front_image), (err) => {
            if (err) console.log("Error deleting book front image", err)
        })
    }
    if (book.back_image) {
        fs.unlink(path.join(IMAGES_PATH, book.back_image), (err) => {
            if (err) console.log("Error deleting book back image", err)
        })
    }

    db.run("DELETE FROM Books WHERE id = ?", [book.id])

    await deleteManyToManyRelation("Authors", book.id)
    await deleteManyToManyRelation("Publishers", book.id)
    await deleteManyToManyRelation("Subjects", book.id)

    await deleteOneToManyRelation("Locations", book.location_id)
    await deleteOneToManyRelation("Languages", book.language_id)
}


export default {
    insertBookInfo,
    updateBookInfo,
    deleteBookInfo,

    getBookByISBN,
    getAuthorByName,
    getPublisherByName,

    getAllBooks,
    getAllAuthors,
    getAllPublishers,
    getAllSubjects,
    getAllLocations,
    getAllLanguages,

    getAuthorsByBook,
    getPublishersByBook,
    getSubjectsByBook,
    getLocationByBook,
    getLanguageByBook,

    getBooksByAuthor,
    getBooksByPublisher,
}
