import * as R from 'ramda'

// Returns a function which passes all arguments to console.log and then takes a generic piece of data and returns it
// unchanged. For logging text in functions.
export const log = (...args: any[]) => <T>(data: T) => R.tap(() => console.log(...args), data)

// Returns a function which passes all arguments to console.log, takes a generic piece of data, runs the transform
// function on that data and logs the result, and finally returns the generic data unchanged. For logging data in
// functions.
export const logAndTransformData = <T>(transform: (data: T) => any, ...args: any[]) => (data: T) => R.tap(() => console.log(...args, transform(data)), data)

// Logs and returns a given value
export const logValue = <T>(data: T) => log(data)(data)

// Does nothing
export const noOp = () => {
}

// Takes in a function and an array, and maps the function over the array, passing an incrementing index
export const mapIndexed = <T, U>(fn: (index: number, item: T) => U, array: T[]) => R.tail(R.mapAccum((acc, val) => [R.inc(acc), fn(acc, val)], 0, array))