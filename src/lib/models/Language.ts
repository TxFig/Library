export interface Language {
    id: number
    value: string
}

export type InsertLanguage = Omit<Language, "id">

export default Language
