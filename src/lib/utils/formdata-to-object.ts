type FormDataObject = {
    [key: string]: FormDataEntryValue | FormDataEntryValue[]
}

/** @deprecated */
export default function(formData: FormData): FormDataObject {
    const entries = [...formData.entries()]
    const object: FormDataObject = {}

    for (const [key, value] of entries) {
        if (object[key]) {
            if (Array.isArray(object[key])) {
                (object[key] as FormDataEntryValue[]).push(value)
            } else {
                object[key] = [object[key], value] as FormDataEntryValue[]
            }
        } else {
            object[key] = value
        }
    }

    return object
}
