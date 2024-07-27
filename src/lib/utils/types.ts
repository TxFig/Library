export type Entries<T> = {
    [K in keyof T]: [K, T[K]]
}[keyof T][]

export type Values<Obj> = Obj[keyof Obj]

export type ReplaceFields<
    Obj,
    Fields extends { [key in keyof Obj]?: any }
> = Omit<Obj, keyof Fields> & Fields

export type Implements<T, U extends T> = U
