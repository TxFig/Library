import type { ExternalBookData } from ".";


function capitalizeFirstLetter(string: string): string {
    return string[0].toUpperCase() + string.substring(1)
}

const RegexCharactersToRemoveSubjects = /[0-9:.]/
export function formatBookData(book: ExternalBookData): ExternalBookData {
    const formattedBook = book

    formattedBook.authors = formattedBook.authors.map(
        author => author.replace("’", "'")
    )
    formattedBook.publishers = formattedBook.publishers.map(
        publisher => publisher.replace("’", "'")
    )

    formattedBook.subjects = formattedBook.subjects.filter(
        subject => !RegexCharactersToRemoveSubjects.test(subject)
    )
    formattedBook.subjects = formattedBook.subjects.map(
        subject => capitalizeFirstLetter(subject.toLowerCase()).replace("’", "'")
    )

    return formattedBook
}
