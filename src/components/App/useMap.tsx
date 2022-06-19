import React, { useEffect, useRef, useState } from "react";
import {useKeyPress} from "./useKeyPress";
import {RNGService, Tile} from "../../services/RNGService";
import { getTileKey } from ".";
import {reverse, shiftRowRight} from "./shift";
import _ from 'lodash';

type AxisType = 'x' | 'y' | 'z';

export const getRowsByAxis = (axis: AxisType, map: Tile[]) => {
    return Object.values(map.reduce((acc: Record<string, Tile[]>, tile) => {
        if(!acc[`_${tile[axis]}`]) {
            acc[`_${tile[axis]}`] = [];
        }
        acc[`_${tile[axis]}`].push(tile);
        return acc;
    }, {}));
}

type GameStatusType = 'playing' | 'game-over';

// todo add library definitions
export const useMap = (hexagons: any) => {
    const [map, setMap] = useState<Tile[]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatusType>('playing')
    const shouldRetrieveMap = useRef(true);

    const isQClicked = useKeyPress('q');
    const isWClicked = useKeyPress('w');
    const isEClicked = useKeyPress('e');
    const isAClicked = useKeyPress('a');
    const isSClicked = useKeyPress('s');
    const isDClicked = useKeyPress('d');

    const isShiftPossibleByAxis = (axis: AxisType, shouldReverse: boolean) => {
        const rows = getRowsByAxis(axis, map);
        let isShiftPossible = false;
        rows.forEach(row => {
            let rowValues = row.map(el => el.value);
            if(shouldReverse) {
                rowValues = reverse(rowValues);
            }
            let shiftedValues = shiftRowRight(rowValues, row.length);
            if(shouldReverse) {
                shiftedValues = shiftedValues.reverse();
            }
            row.forEach((el, index) => {
                if(el.value !== shiftedValues[index]) {
                    isShiftPossible = true;
                }
            })
            return row;
        });
        return isShiftPossible;
    }

    const shiftMapByAxis = (axis: AxisType, shouldReverse: boolean) => {
        const rows = getRowsByAxis(axis, map);
        const newRows = rows.map(row => {
            let rowValues = row.map(el => el.value);
            if(shouldReverse) {
                rowValues = reverse(rowValues);
            }
            let shiftedValues = shiftRowRight(rowValues, row.length);
            if(shouldReverse) {
                shiftedValues = shiftedValues.reverse();
            }
            const newRow = row.map((el, index) => {
                return {
                    ...el,
                    value: shiftedValues[index],
                }
            })
            return newRow;
        });

        const newMap = _.flatten(newRows);
        let isMapChanged = false;
        map.forEach((tile, i) => {
            if(newMap[i].value !== map[i].value) {
                isMapChanged = true;
            }
        })

        if(isMapChanged) {
            shouldRetrieveMap.current = true;
            setMap(newMap);
        }
    }

    // game init
    useEffect(() => {
        (async () => {
            if(!shouldRetrieveMap.current) {
                return;
            }
            const newMapData = await RNGService.getMap(map.filter(el => el.value !== 0));
            let newIndexedMap = hexagons.reduce((acc: Record<string, Tile>, hex: any) => {
                acc[getTileKey(hex.q, hex.s, hex.r)] = {
                    x: hex.q,
                    y: hex.s,
                    z: hex.r,
                    value: 0,
                }
                return acc;
            }, {});

            [...map, ...newMapData].forEach((tile: Tile) => {
                if(newIndexedMap[getTileKey(tile.x, tile.y, tile.z)].value === 0) {
                    newIndexedMap[getTileKey(tile.x, tile.y, tile.z)] = tile;
                }
            });

            const newMap = Object.values(newIndexedMap) as Tile[];
            setMap(newMap);
            shouldRetrieveMap.current = false;
        })()
    }, [map, shouldRetrieveMap.current]);

    useEffect(() => {
        if(isQClicked) {
            shiftMapByAxis('z', true);
        }
        else if(isDClicked) {
            shiftMapByAxis('z', false);
        }
        else if(isWClicked) {
            shiftMapByAxis('x', true);
        }
        else if(isSClicked) {
            shiftMapByAxis('x', false);
        }
        else if(isAClicked) {
            shiftMapByAxis('y', true);
        }
        else if(isEClicked) {
            shiftMapByAxis('y', false);
        }

    }, [isQClicked, isWClicked, isEClicked, isAClicked, isSClicked, isDClicked]);

    useEffect(() => {
        const isAnyMovePossible = isShiftPossibleByAxis('x', true) ||
            isShiftPossibleByAxis('x', false) ||
            isShiftPossibleByAxis('y', true) ||
            isShiftPossibleByAxis('y', false) ||
            isShiftPossibleByAxis('z', true) ||
            isShiftPossibleByAxis('z', false);

        setGameStatus(isAnyMovePossible ? 'playing' : 'game-over');
    },[map])

    return [map, gameStatus] as [Tile[], GameStatusType];
}
