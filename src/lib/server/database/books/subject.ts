import type { Subject } from "@prisma/client";
import { prisma } from "..";


export function getAllSubjects(): Promise<Subject[]> {
    return prisma.subject.findMany()
}


export default {
    getAllSubjects
}
