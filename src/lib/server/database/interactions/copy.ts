import type { ApplyTransformSpec } from "$lib/utils/transform-object";
import type { CopyLoan, CopyRequest } from "@prisma/client";
import prisma from "$lib/server/database/prisma";
import type { copyLoanTransform, copyRequestTransform } from "$lib/transforms";


export type CopyRequestTransformed = ApplyTransformSpec<CopyRequest, { $: typeof copyRequestTransform }>
export type CopyLoanTransformed = ApplyTransformSpec<CopyLoan, { $: typeof copyLoanTransform }>

export default {
    request: {
        create: prisma.copyRequest.create,
        update: prisma.copyRequest.update,
        getUnique: prisma.copyRequest.findUnique,
        getAll: prisma.copyRequest.findMany,
        deleteMany: prisma.copyRequest.deleteMany
    },
    loan: {
        create: prisma.copyLoan.create,
        update: prisma.copyLoan.update,
        getUnique: prisma.copyLoan.findUnique
    },

    getUnique: prisma.bookCopy.findUnique,
    getAll: prisma.bookCopy.findMany,
    update: prisma.bookCopy.update
}
