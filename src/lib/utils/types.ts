export type Entries<T> = {
    [K in keyof T]: [K, T[K]]
}[keyof T][]

export type Values<Obj> = Obj[keyof Obj]
