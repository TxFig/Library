export const filterRegex = (regex: RegExp, value: string) =>
    [...value].filter(v => regex.test(v)).join("")

export default filterRegex
