export interface Subject {
    id: number
    value: string
}

export type InsertSubject = Omit<Subject, "id">

export interface BooksSubjects {
    book_id: number,
    subject_id: number
}

export default Subject
