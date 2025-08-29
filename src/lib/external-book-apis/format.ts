import type { ExternalBookData } from ".";


function capitalizeFirstLetter(string: string): string {
    return string[0].toUpperCase() + string.substring(1)
}

const RegexCharactersToRemoveSubjects = /[0-9:.]/
export function formatBookData(book: ExternalBookData): ExternalBookData {
    book.authors = book.authors.map(
        author => author.replace("’", "'")
    )
    book.subjects = book.subjects.filter(
        subject => !RegexCharactersToRemoveSubjects.test(subject)
    )
    book.subjects = book.subjects.map(
        subject => capitalizeFirstLetter(subject.toLowerCase()).replace("’", "'")
    )

    book.edition.publishers = book.edition.publishers.map(
        publisher => publisher.replace("’", "'")
    )

    return book
}
