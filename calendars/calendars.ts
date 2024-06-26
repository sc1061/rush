import ical, { CalendarComponent } from 'node-ical'

const SOURCE = 'https://calendars.icloud.com/holiday/cn_zh.ics'

type CalendarsCache = {
    time: number;
    cached: boolean;
    workingDays: string[]
    holidays: string[]
}

declare global {
    var cache: CalendarsCache | undefined
}

let cache = globalThis.cache || {
    time: Date.now(),
    cached: false,
    workingDays: [],
    holidays: []
}

globalThis.cache = cache

function format(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

}

function caculateRange(start: Date, end: Date) {
    let current = start
    let endDate = format(end)
    let currentDate = format(current)
    let tmp = []
    while (currentDate !== endDate) {
        tmp.push(currentDate)
        current.setDate(current.getDate()+1)
        currentDate = format(current)
    }
    return tmp
}

function parseEvent(event: CalendarComponent) {
    if(event.type == 'VEVENT') {
        // @ts-ignore
        if(event.summary.val.match('班')) {
            let range = caculateRange(event.start, event.end)
            cache.workingDays.push(...range)
        }
        // @ts-ignore
        if(event.summary.val.match('休')) {
            let range = caculateRange(event.start, event.end)
            cache.holidays.push(...range)
        }
    }
}

export function isWorkingDay(date: Date) {
    let formatDate = format(date)
    const {workingDays, holidays} = cache
    if(workingDays.some(item => item == formatDate)) {
        return true
    }
    if(holidays.some(item => item == formatDate)) {
        return false
    }
    if(date.getDay() > 0 && date.getDay() < 6) {
        return true
    }
    return false
}

export async function cacheCalendars() {
    const events = await ical.async.fromURL(SOURCE)
    cache.time = Date.now()
    cache.cached = false
    cache.holidays = []
    cache.workingDays = []
    for(let event of Object.values(events)) {
        parseEvent(event)
    }
    cache.cached = true
}

export function isCalendarsCache() {
    return cache.cached
}

export function getCurrentCache() {
    return {
        time: cache.time
    }
}