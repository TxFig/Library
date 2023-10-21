export interface Location {
    id: number
    value: string
}

export type InsertLocation = Omit<Location, "id">

export default Location
