export default {

    book: {
        create: {
            success: "Book created",
            error  : "Failed to create book"
        },

        delete: {
            success: "Book deleted",
            error  : "Failed to delete book"
        }
    },

    edition: {
        create: {
            success: "Edition created",
            error  : "Failed to create edition"
        }
    },

    rating: {
        update: {
            success: "Rating updated",
            error  : "Failed to update rating"
        }
    },

    readingState: {
        update: {
            success: "Reading state updated",
            error  : "Failed to update reading state"
        }
    },

    author: {
        replaced: {
            success: "Authors replaced",
            error  : "Failed to replace authors"
        }
    },

    subject: {
        delete: {
            success: "Subject deleted",
            error  : "Failed to delete subject",
        }
    },

    copy: {
        not_found  : "Copy not found",
        forbidden  : "Only the owner of the book copy can perform this action",
        unavailable: "Copy unavailable",

        update: {
            success: "Copy updated",
            error  : "Failed to update copy"
        },
    },

    copyRequest: {
        not_found: "Copy request not found",
        forbidden: "Only the owner of the request can perform this action",
        cancelled: "Copy request cancelled",
        unique: "You can only have a request for this copy at a time",

        create: {
            success: "Copy request created",
            error  : "Failed to create copy request",
        },

        update: {
            success: "Copy request updated",
            error  : "Failed to update copy request"
        },

        accept: {
            success: "Copy request accepted",
            error  : "Failed to accept copy request"
        },
        reject: {
            success: "Copy request rejected",
            error  : "Failed to reject copy request"
        },
    },

    loan: {
        create: {
            success: "Copy loan created",
        },
        not_found: "Loan not found",
        forbidden: "Only the owner of the loan can perform this action",

        update: {
            success: "Copy loan updated",
            error  : "Failed to update copy loan"
        },
    },

    email: {
        sent: "Email sent"
    }

} as const
