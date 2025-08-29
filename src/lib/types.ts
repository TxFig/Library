import type { Prisma } from "@prisma/client"
import type { ApplyTransformSpec, TransformSpec } from "$lib/utils/transform-object"
import transforms from "./transforms"

// export const BookCollectionEditionsInclude = {
//     image: true
// } as const
// export const BookCollectionWithBooksInclude = {
//     editions: {
//         include: BookCollectionEditionsInclude
//     }
// } as const
// export type BookCollectionWithBooks = Prisma.BookCollectionGetPayload<{
//     include: typeof BookCollectionWithBooksInclude
// }>
// export type BuiltInBookCollectionWithBooks = Omit<BookCollectionWithBooks, "id" | "createdAt" | "updatedAt">

// export const BookEditionWithSearchPropertiesInclude = {
//     language: true,
//     image: true,
//     publishers: true,
//     book: {
//         include: {
//             authors: true,
//             subjects: true
//         }
//     },
//     copies: {
//         include: {
//             location: true
//         }
//     }
// } as const
// export type BookEditionWithSearchProperties = Prisma.BookEditionGetPayload<{
//     include: typeof BookEditionWithSearchPropertiesInclude
// }>

// export const DisplayBookInclude = {
//     authors: true,
//     publishers: true,
//     subjects: true,
//     publish_date: true,
//     location: true,
//     language: true,
//     image: true
// } as const
// export type DisplayBook = Prisma.BookGetPayload<{
//     include: typeof DisplayBookInclude
// }>

// export const DisplayBookEditionInclude = {
//     authors: true,
//     publishers: true,
//     subjects: true,
//     publish_date: true,
//     location: true,
//     language: true,
//     image: true
// } as const
// export type DisplayBookEdition = Prisma.BookGetPayload<{
//     include: typeof DisplayBookEditionInclude
// }>

export namespace EditionCreate {
    export const include = {
        publishDate: true,
        language: true,
        authors: true,
        publishers: true,
        image: true,
        copies: {
            include: {
                location: true
            }
        },
        book: {
            include: {
                authors: true,
                subjects: true
            }
        }
    } satisfies Prisma.BookEditionInclude

    export type Raw = Prisma.BookEditionGetPayload<{ include: typeof include }>
    export const spec = {
        $: transforms.edition,
        publishDate: { $: transforms.publishDate },
        language: { $: transforms.language },
        authors: { $: transforms.author },
        publishers: { $: transforms.publisher },
        image: { $: transforms.image },
        copies: {
            $: transforms.copy,
            location: { $: transforms.location }
        },
        book: {
            $: transforms.book,
            authors: { $: transforms.author },
            subjects: { $: transforms.subject }
        },
    } satisfies TransformSpec<Raw>
    type Spec = typeof spec

    export type Type = ApplyTransformSpec<Raw, Spec>
}

export namespace BookCreate {
    export const include = {
        authors: true,
        editions: {
            include: {
                publishDate: true,
                language: true,
                authors: true,
                publishers: true,
                image: true,
                copies: {
                    include: {
                        location: true
                    }
                }
            }
        },
        subjects: true
    } satisfies Prisma.BookInclude

    export type Raw = Prisma.BookGetPayload<{ include: typeof include }>

    export const spec = {
        $: transforms.book,
        authors: { $: transforms.author },
        editions: {
            $: transforms.edition,
            publishDate: { $: transforms.publishDate },
            language: { $: transforms.language },
            authors: { $: transforms.author },
            publishers: { $: transforms.publisher },
            image: { $: transforms.image },
            copies: {
                $: transforms.copy,
                location: { $: transforms.location }
            }
        },
        subjects: { $: transforms.subject }
    } satisfies TransformSpec<Raw>
    type Spec = typeof spec

    export type Type = ApplyTransformSpec<Raw, Spec>
}

export namespace ScanPage {
    export namespace BookWithEditions {
        export const include = {
            editions: {
                include: {
                    image: true,
                    publishers: true
                }
            },
            authors: true
        } satisfies Prisma.BookInclude
        export type Raw = Prisma.BookGetPayload<{ include: typeof include }>
        export const spec = {
            $: transforms.book,
            authors: { $: transforms.author },
            editions: {
                $: transforms.edition,
                image: { $: transforms.image },
                publishers: { $: transforms.publisher }
            }
        } satisfies TransformSpec<Raw>
        type Spec = typeof spec
        export type Type = ApplyTransformSpec<Raw, Spec>
    }
    export type BookWithEditions = BookWithEditions.Type

    export namespace DuplicateEdition {
        export const include = {
            image: true,
            book: {
                include: {
                    authors: true
                }
            }
        } satisfies Prisma.BookEditionInclude
        export type Raw = Prisma.BookEditionGetPayload<{ include: typeof include }>
        export const spec = {
            $: transforms.edition,
            image: { $: transforms.image },
            book: {
                $: transforms.book,
                authors: { $: transforms.author }
            }
        } satisfies TransformSpec<Raw>
        type Spec = typeof spec
        export type Type = ApplyTransformSpec<Raw, Spec>
    }
    export type DuplicateEdition = DuplicateEdition.Type
}

export namespace BookPage {
    export namespace DisplayBook {
        export const include = (userId?: number) => ({
            authors: true,
            editions: {
                include: {
                    image: true,
                    ratings: true,
                    authors: true,
                    publishDate: true,
                    language: true,
                    copies: {
                        include: {
                            location: true,
                            owner: true,
                            requests: {
                                where: {
                                    userId,
                                    status: "pending"
                                }
                            }
                        }
                    },
                    publishers: true,
                    readingStates: {
                        where: { userId }
                    }
                }
            },
            subjects: true
        }) satisfies Prisma.BookInclude
        export type Raw = Prisma.BookGetPayload<{ include: ReturnType<typeof include> }>
        export const spec = {
            $: transforms.book,
            authors: { $: transforms.author },
            editions: {
                $: {
                    ...transforms.edition,
                    remove: [...transforms.edition.remove, "readingStates"]
                },
                image: { $: transforms.image },
                ratings: {
                    $: { pick: "rating" }
                },
                authors: { $: transforms.author },
                publishDate: { $: transforms.publishDate },
                language: { $: transforms.language },
                copies: {
                    $: {
                        ...transforms.copy,
                        remove: [...transforms.copy.remove, "requests"]
                    },
                    location: { $: transforms.location },
                    owner: { $: transforms.user },
                    requests: {
                        $: transforms.copyRequest
                    }
                },
                publishers: { $: transforms.publisher }
            },
            subjects: { $: transforms.subject }
        } satisfies TransformSpec<Raw>
        type Spec = typeof spec
        export type Type = ApplyTransformSpec<Raw, Spec>
    }
    export type DisplayBook = DisplayBook.Type
    export type DisplayEdition = DisplayBook["editions"][number]
    export type DisplayCopy = DisplayEdition["copies"][number]
}

export namespace CopyRequestAccept {
    export const include = {
        user: true
    } satisfies Prisma.CopyLoanInclude
    export type Raw = Prisma.CopyLoanGetPayload<{ include: typeof include }>
    export const spec = {
        $: transforms.copyLoan,
        user: { $: transforms.user }
    } satisfies TransformSpec<Raw>
    export type Spec = typeof spec
    export type Type = ApplyTransformSpec<Raw, Spec>
}

export namespace DashboardCopiesPage {
    export namespace Copy {
        export const include = {
            edition: {
                include: {
                    book: true
                }
            },
            location: true,
            requests: {
                include: {
                    user: true
                }
            },
            loans: {
                include: {
                    user: true
                }
            }
        } satisfies Prisma.BookCopyInclude
        export type Raw = Prisma.BookCopyGetPayload<{ include: typeof include }>
        export const spec = {
            $: transforms.copy,
            edition: {
                $: transforms.edition,
                book: { $: transforms.book }
            },
            // location: { $: transforms.location },
            requests: {
                $: transforms.copyRequest,
                user: { $: transforms.user }
            },
            loans: {
                $: transforms.copyLoan,
                user: { $: transforms.user }
            }
        } satisfies TransformSpec<Raw>
        type Spec = typeof spec
        export type Type = ApplyTransformSpec<Raw, Spec>
    }
    export type Copy = Copy.Type
    export type RequestsModalResponse = false | undefined | (
        { id: string } & (
            { status: "accepted", loan: CopyRequestAccept.Type } |
            { status: "rejected"}
        )
    )

    export namespace Request {
        export const include = {
            copy: {
                include: {
                    owner: true,
                    edition: {
                        include: {
                            book: true
                        }
                    },
                    location: true,
                }
            },
            loan: true
        } satisfies Prisma.CopyRequestInclude
        export type Raw = Prisma.CopyRequestGetPayload<{ include: typeof include }>
        export const spec = {
            $: transforms.copyRequest,
            copy: {
                $: transforms.copy,
                owner: { $: transforms.user },
                edition: {
                    $: transforms.edition,
                    book: { $: transforms.book }
                },
                location: { $: transforms.location },
            },
            loan: { $: transforms.copyLoan }
        } satisfies TransformSpec<Raw>
        type Spec = typeof spec
        export type Type = ApplyTransformSpec<Raw, Spec>
    }
    export type Request = Request.Type
}

export namespace PageData {
    export namespace User {
        export const include = {
            permissionGroup: {
                include: {
                    permissions: true
                }
            }
        } satisfies Prisma.UserInclude
        export type Raw = Prisma.UserGetPayload<{ include: typeof include }>
        export const spec = {
            $: transforms.user,
            permissionGroup: {
                $: transforms.permissionGroup,
                permissions: {
                    $: transforms.permission
                }
            }
        } satisfies TransformSpec<Raw>
        type Spec = typeof spec
        export type Type = ApplyTransformSpec<Raw, Spec>
    }
    export type User = User.Type
    export namespace Session {
        export const include = {} satisfies Prisma.SessionInclude
        export type Raw = Prisma.SessionGetPayload<{ include: typeof include }>
        export const spec = {
            $: {
                remove: ["id", "userId"]
            }
        } satisfies TransformSpec<Raw>
        type Spec = typeof spec
        export type Type = ApplyTransformSpec<Raw, Spec>
    }
    export type Session = Session.Type
}
