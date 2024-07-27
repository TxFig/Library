type GenericObject = { [key: string]: any }

function isObjectEmpty(object: GenericObject): boolean {
    return Object.keys(object).length == 0
}

/** @deprecated */
function clearEmptyFields<Object extends GenericObject>(object: Object): Partial<Object> {
    let newObject: GenericObject = {}

    for (const key in object) {
        const value = object[key]

        if (
            (typeof value === "string" && value.length !== 0) ||
            (typeof value === "number" || typeof value === "bigint")
        ) {
            newObject[key] = value
        }
        else if (Array.isArray(value)) {
            if (value.length !== 0) {
                newObject[key] = value
            }
            continue
        }
        else if (typeof value == "object" && value !== null) {
            const newSubObject = clearEmptyFields(value)
            if (!isObjectEmpty(newSubObject)) {
                newObject[key] = newSubObject
            }
        }
    }

    return newObject as Partial<Object>
}


export default clearEmptyFields
