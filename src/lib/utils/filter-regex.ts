export const filterRegex = (regex: RegExp, value: string) =>
    [...value].filter(char => regex.test(char)).join("")


export default filterRegex
