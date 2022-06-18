import {reverse, shiftRow, shiftRowRight} from "./shift";

describe('shift', () => {
    it('should reverse a row', () => {
        expect(reverse([0, 0, 2, 2])).toEqual([2, 2, 0, 0]);
    });

    it('shifting right should works according to 2048 rules', () => {
        expect(shiftRowRight([0, 0, 2, 2], 4)).toEqual([0,0,0,4]);
        expect(shiftRowRight([0, 2, 2, 2], 4)).toEqual([0,0,2,4]);
        expect(shiftRowRight([0, 2, 2, 4], 4)).toEqual([0,0,4,4]);
        expect(shiftRowRight([0, 4, 2, 2], 4)).toEqual([0,0,4,4]);
        expect(shiftRowRight([2, 4, 2, 4], 4)).toEqual([2,4,2,4]);
        expect(shiftRowRight([2, 2, 4, 4], 4)).toEqual([0,0,4,8]);
    });
})

