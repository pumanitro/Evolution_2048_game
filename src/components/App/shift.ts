// utility functions
export const reverse = (xs: number[]) =>
    [...xs] .reverse();

// helper functions
const shift = ([n0, n1, ...ns]: number[]): number[] =>
    n0 == undefined
        ? []
        : n0 == 0
            ? shift ([n1, ...ns])
            : n1 == 0
                ? shift ([n0, ...ns])
                : n0 == n1
                    ? [n0 + n1, ... shift (ns)]
                    : [n0, ... shift ([n1, ... ns])]

export const shiftRow = (ns: number[], size: number) =>
    shift (ns) .concat (new Array(size).fill(0)) .slice (0, size);

export const shiftRowRight = (xs: number[], size :number) =>
    reverse(shiftRow (reverse (xs), size));
