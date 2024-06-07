export function generateExpirationDate(time: number): Date {
    const now = new Date()
    now.setSeconds(now.getSeconds() + time)
    return now
}


export default generateExpirationDate
