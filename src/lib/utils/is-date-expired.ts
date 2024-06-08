export function isDateExpired(date: Date): boolean {
    return date.getTime() < Date.now()
}


export default isDateExpired
