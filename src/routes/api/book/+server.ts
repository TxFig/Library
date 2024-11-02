import type { RequestEvent } from "./$types";

import { BookCreateSchema } from "$lib/validation/book/book";
import api from "$lib/server/api"
import { BaseEndpoint, FormEndpoint } from "$lib/server/api/endpoint";


export const GET = BaseEndpoint<RequestEvent>(api.book.GET)
export const POST = FormEndpoint<RequestEvent, BookCreateSchema>(api.book.POST, BookCreateSchema)
