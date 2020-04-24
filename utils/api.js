import { AsyncStorage } from 'react-native'
import { CALENDAR_STORAGE_KEY } from './_calendar'

export function submitEntry({ entry, day }) {
    // submit new entry for the day and add it to AsyncStorage
    return AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({
        [day]: entry
    }))
}

export function removeEntry(day) {
    // remove entry for the specified day
    return AsyncStorage.getItem(CALENDAR_STORAGE_KEY)
        .then(results => {
            const data = JSON.parse(results)
            data[day] = undefined
            delete data[day]

            // set the data again, now without the entry we wanted to remove
            AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data))
        })
}
