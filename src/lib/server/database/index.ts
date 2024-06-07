import { dev } from "$app/environment"
import { PrismaClient } from "@prisma/client"

declare global {
    var prismaClient: PrismaClient
}


export const prisma = getPrismaClientInstance()

function getPrismaClientInstance() {
    if (dev) {
        global.prismaClient ??= new PrismaClient()
        return global.prismaClient
    } else {
        return new PrismaClient()
    }
}

export async function close() {
    await prisma.$disconnect()
}


import book from "./book"
import auth from "./auth/"

export default {
    book,
    auth,
    close
}
