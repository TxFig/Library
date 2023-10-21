export interface Author {
    id: number
    name: string
}

export type InsertAuthor = Omit<Author, "id">

export interface BooksAuthors {
    book_id: number,
    author_id: number
}

export default Author
