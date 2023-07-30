import * as IO from 'fp-ts-std/IO'
import * as C from 'fp-ts/Console'
import * as util from "util";

// Returns a function which passes all arguments to console.log and then takes a generic piece of data and returns it
// unchanged. For logging text in functions.
export const log = (...args: any[]) => <T>(data: T) => IO.tap<T>((_ :T) => C.log(util.format(...args)))(data)()

// Returns a function which passes all arguments to console.log, takes a generic piece of data, runs the transform
// function on that data and logs the result, and finally returns the generic data unchanged. For logging data in
// functions.
export const logAndTransformData = <T>(transform: (data: T) => any, ...args: any[]) => (data: T) => IO.tap<T>(() => C.log(util.format(...args, transform(data))))(data)()

// Logs and returns a given value
export const logValue = <T>(data: T) => log(data)(data)

// Does nothing
export const noOp = () => {
}
