import type { Language } from "@prisma/client";
import { prisma } from "..";


export function getAllLanguages(): Promise<Language[]> {
    return prisma.language.findMany()
}


export default {
    getAllLanguages
}
