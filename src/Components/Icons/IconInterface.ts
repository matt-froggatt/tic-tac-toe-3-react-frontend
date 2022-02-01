import * as R from "ramda";

// Stupid hack to prevent red and blue from becoming types
export const enum Colour {
    RED = 1 + 2,
    BLUE = 2 + 3
}

export const getColourStyle: (c: Colour) => string = R.cond<[c: Colour], string>([
    [R.equals(Colour.BLUE), R.always('text-blue-500')],
    [R.equals(Colour.RED), R.always('text-red-500')]
])

export default interface IconInterface {
    colour: Colour
}