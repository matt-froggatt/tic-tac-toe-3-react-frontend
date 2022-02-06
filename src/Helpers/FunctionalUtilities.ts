import * as R from 'ramda'

// Returns a function which passes all arguments to console.log and then takes a generic piece of data and returns it
// unchanged. For logging text in functions.
export const log = (...args: any[]) => <T>(data: T) => R.tap(() => console.log(...args), data)

// Returns a function which logs the given array, where each element is an argument to console.log, to the console and
// then takes a generic piece of data and returns it unchanged. For logging text in functions.
export const logData = <T>(msg: (data: T) => any[]) => (data: T) => log(...msg(data))(data)