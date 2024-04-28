import ical, { CalendarComponent } from 'node-ical'

const SOURCE = 'https://calendars.icloud.com/holiday/cn_zh.ics'

const cache = {
    cached: false,
    workingDays: [] as string[],
    holidays: [] as string[]
}

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
        if(event.summary.val.match('班')) {
            let range = caculateRange(event.start, event.end)
            cache.workingDays.push(...range)
        }
        if(event.summary.val.match('休')) {
            let range = caculateRange(event.start, event.end)
            cache.holidays.push(...range)
        }
    }
}

export function isWorkingDay(date: Date) {
    let formatDate = format(date)
    const {workingDays, holidays} = cache
    console.log(cache.cached)
    if(workingDays.some(item => item == formatDate)) {
        console.log('match')
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
    cache.cached = false
    cache.holidays = []
    cache.workingDays = []
    for(let event of Object.values(events)) {
        parseEvent(event)
    }
    cache.cached = true
}