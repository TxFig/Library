export function round(number: number, precision: number): number {
    return Math.round(number * 10 ** precision) / 10 ** precision
}

export default round
