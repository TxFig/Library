import type { Actions, PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import db from "$lib/server/database/"
import HttpCodes from "$lib/utils/http-codes"
import { ISBNSchema } from "$lib/validation/book/isbn"
import api from "$lib/server/api"
import { applyDecorators } from "$lib/decorators"
import AuthDecorator from "$lib/decorators/auth"
import { fail, message, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import type { BookPatchMethodReturn } from "$lib/server/api/book/PATCH"
import ParseParamsDecorator from "$lib/decorators/parse-params"
import { BookCreateSchema, type BookCreateFormDataInput } from "$lib/validation/book/_book"
import type { Prisma } from "@prisma/client"



type BookWithFormData = Prisma.BookGetPayload<{
    include: {
        publish_date: true,
        location: true,
        language: true,
        authors: true,
        publishers: true,
        subjects: true,
    }
}>
async function EntireBookToBookCreateFormData(book: BookWithFormData): Promise<BookCreateFormDataInput> {
    return {
        isbn: book.isbn,
        title: book.title,
        subtitle: book.subtitle,
        number_of_pages: book.number_of_pages,
        isbn10: book.isbn10,
        isbn13: book.isbn13,
        publish_date: book.publish_date ?? undefined,
        image: undefined,
        location: book.location?.value,
        language: book.language?.value,
        authors: book.authors.map(author => author.name),
        publishers: book.publishers.map(publisher => publisher.name),
        subjects: book.subjects.map(subject => subject.value)
    }
}

const load: PageServerLoad = async ({ params }) => {
    const { isbn } = params

    const book = await db.books.book.getUniqueBook({
        where: { isbn },
        include: {
            publish_date: true,
            location: true,
            language: true,
            authors: true,
            publishers: true,
            subjects: true,
            image: true
        }
    })
    if (!book) {
        error(HttpCodes.ClientError.NotFound, "Book Not Available")
    }

    const data = await EntireBookToBookCreateFormData(book)
    let imageUrl: string | undefined = undefined
    if (book.image.length > 0) {
        const largestImage = book.image.sort((a, b) => b.height - a.height)[0]
        imageUrl = `/images/${book.isbn}/${largestImage.height}.webp`
    }
    const form = await superValidate(data, zod(BookCreateSchema), { errors: false })

    return {
        form,
        imageUrl,
        allAuthors: await db.books.author.getAllAuthors(),
        allPublishers: await db.books.publisher.getAllPublishers(),
        allSubjects: await db.books.subject.getAllSubjects(),
        allLocations: await db.books.location.getAllLocations(),
        allLanguages: await db.books.language.getAllLanguages()
    }
}

const decoratedLoad = applyDecorators([
    ParseParamsDecorator({
        isbn: {
            schema: ISBNSchema,
            onError: () => error(HttpCodes.ClientError.BadRequest, "Invalid ISBN")
        }
    }),
    AuthDecorator(["Edit Book"])
], load)

export { decoratedLoad as load }


export const actions: Actions = {
    default: applyDecorators(
        [AuthDecorator(["Edit Book"])],
        async ({ request, locals }) => {
            const formData = await request.formData()
            const form = await superValidate(formData, zod(BookCreateSchema))

            if (!form.valid) {
                return fail(HttpCodes.ClientError.BadRequest, { form })
            }

            let info: BookPatchMethodReturn
            try {
                info = await api.book.PATCH(form, locals.user!.id)

                return message(form, {
                    type: info.success ? "success" : "error",
                    text: info.message
                }, !info.success ? {
                    status: info.code
                } : undefined)
            }
            catch (err) {
                error(HttpCodes.ServerError.InternalServerError, "Internal Server Error")
            }
        }
    )
}
