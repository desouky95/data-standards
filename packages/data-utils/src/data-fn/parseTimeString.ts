const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.23
const unitConvertorMap = {
    'y': (v: number) => v * y,
    'w': (v: number) => v * w,
    'd': (v: number) => v * d,
    'h': (v: number) => v * h,
    'm': (v: number) => v * m,
    's': (v: number) => v * s,
}

type SingleTimeUnit = 'Day' | 'Year' | 'Second' | 'Minute' | 'Week' | 'Hour'
type MultipleTimeUnit = 'Days' | 'D' | 'Years' | 'Y' | 'Seconds' | 'S' | 'Minutes' | 'M' | 'Weeks' | 'W' | 'Hours' | 'H'

export type TimeString = `${1} ${SingleTimeUnit}` | Exclude<`${number} ${MultipleTimeUnit}`, `${1} ${any}`>

/** 
 * @param input 
 * @returns parsed TimeString to ms
 * @example
 * ```ts
 * const ms = parseTimeString('1 Day') 
 * console.log(ms) // 86400000
 * ```
*/
export const parseTimeString = (input: TimeString): number | undefined => {
    const regex = /(\d+) (Days|Day|D|Years|Year|Y|Seconds|Second|S|Minutes|Minute|M|Weeks|Week|W|Hours|Hour|H)/gm
    const match = regex.exec(input)
    if (!match) throw new Error('Invalid TimeString Value')
    const value = parseInt(match[1], 10)
    const type = match[2][0].toLowerCase() as keyof typeof unitConvertorMap
    if (!unitConvertorMap[type]) throw new Error('Time unit not available')
    return unitConvertorMap[type](value)

}

export default parseTimeString