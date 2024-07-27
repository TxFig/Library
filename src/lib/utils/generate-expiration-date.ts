export function generateExpirationDate(timeSeconds: number): Date {
    const now = new Date()
    now.setSeconds(now.getSeconds() + timeSeconds)
    return now
}


export default generateExpirationDate
