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
    }

    return new PrismaClient()
}

export default prisma
