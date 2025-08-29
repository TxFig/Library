import type { TransformSpec } from "$lib/utils/transform-object"
import type { Author, Book, BookCopy, BookEdition, CopyLoan, CopyRequest, Image, Language, Location, Permission, PermissionGroup, PublishDate, Publisher, Subject, User } from "@prisma/client"


export const bookTransform = {
    replace: { id: "publicId" }
} as const satisfies TransformSpec<Book>["$"]

export const editionTransform = {
    replace: { id: "publicId" },
    remove: ["bookId", "languageId"],
} as const satisfies TransformSpec<BookEdition>["$"]

export const authorTransform = {
    pick: "name"
} as const satisfies TransformSpec<Author>["$"]

export const publishDateTransform = {
    remove: ["id", "editionId"]
} as const satisfies TransformSpec<PublishDate>["$"]

export const languageTransform = {
    pick: "value"
} as const satisfies TransformSpec<Language>["$"]

export const publisherTransform = {
    pick: "name"
} as const satisfies TransformSpec<Publisher>["$"]

export const imageTransform = {
    pick: "height"
} as const satisfies TransformSpec<Image>["$"]

export const copyTransform = {
    replace: { id: "publicId" },
    remove: ["editionId", "locationId", "ownerId"]
} as const satisfies TransformSpec<BookCopy>["$"]

export const locationTransform = {
    pick: "value"
} as const satisfies TransformSpec<Location>["$"]

export const subjectTransform = {
    pick: "value"
} as const satisfies TransformSpec<Subject>["$"]

export const userTransform = {
    replace: { id: "publicId" },
    remove: ["permissionGroupId", "email"]
} as const satisfies TransformSpec<User>["$"]

export const permissionGroupTransform = {
    remove: ["id"]
} as const satisfies TransformSpec<PermissionGroup>["$"]

export const permissionTransform = {
    remove: ["id"]
} as const satisfies TransformSpec<Permission>["$"]

export const copyRequestTransform = {
    remove: ["copyId", "userId"],
    replace: { id: "publicId" }
} as const satisfies TransformSpec<CopyRequest>["$"]

export const copyLoanTransform = {
    remove: ["copyId", "requestId", "userId"],
    replace: { id: "publicId" }
} as const satisfies TransformSpec<CopyLoan>["$"]


export default {
    book: bookTransform,
    edition: editionTransform,
    author: authorTransform,
    publishDate: publishDateTransform,
    language: languageTransform,
    publisher: publisherTransform,
    image: imageTransform,
    copy: copyTransform,
    location: locationTransform,
    subject: subjectTransform,
    user: userTransform,
    permissionGroup: permissionGroupTransform,
    permission: permissionTransform,
    copyRequest: copyRequestTransform,
    copyLoan: copyLoanTransform
}
