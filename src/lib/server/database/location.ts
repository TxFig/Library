import { db } from "."
import type Book from "$lib/models/Book"
import type Location from "$lib/models/Location"


export async function getAllLocations(): Promise<Location[]> {
    return await db.all<Location[]>("SELECT * FROM Locations")
}

export async function getLocationByBook(book: Book): Promise<Location | null> {
    return await db.get<Location>(
        `SELECT * FROM Locations
        WHERE id = ?`,
        [book.location_id]
    ) ?? null
}
