export interface Publisher {
    id: number
    name: string
}

export type InsertPublisher = Omit<Publisher, "id">

export interface BooksPublishers {
    book_id: number,
    publisher_id: number
}

export default Publisher
