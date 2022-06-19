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

// todo add library definitions
export const useMap = (hexagons: any) => {
    const [map, setMap] = useState<Tile[]>([]);
    const shouldRetrieveMap = useRef(true);

    const isQClicked = useKeyPress('q');
    const isWClicked = useKeyPress('w');
    const isEClicked = useKeyPress('e');
    const isAClicked = useKeyPress('a');
    const isSClicked = useKeyPress('s');
    const isDClicked = useKeyPress('d');

    const shiftMapByAxis = (axis: AxisType, shouldReverse: boolean) => {
        const rows = getRowsByAxis(axis, map);
        const newRows = rows.map(row => {
            let shiftedValues = shiftRowRight(row.map(el => el.value), row.length);
            if(shouldReverse) {
                shiftedValues = reverse(shiftedValues);
            }
            row.forEach((el, index) => {
                el.value = shiftedValues[index];
            })
            return row;
        });
        shouldRetrieveMap.current = true;
        setMap(_.flatten(newRows));
    }

    // game init
    useEffect(() => {
        (async () => {
            if(!shouldRetrieveMap.current) {
                return;
            }
            const newMapData = await RNGService.getMap(map.filter(el => el.value !== 0));
            let newIndexedMap = hexagons.reduce((acc: Record<string, Tile>, hex: any) => {
                acc[getTileKey(hex.q, hex.r, hex.s)] = {
                    x: hex.q,
                    y: hex.r,
                    z: hex.s,
                    value: 0,
                }
                return acc;
            }, {});

            [...map, ...newMapData].forEach((tile: Tile) => {
                newIndexedMap[getTileKey(tile.x, tile.y, tile.z)] = tile;
            });

            const newMap = Object.values(newIndexedMap) as Tile[];
            setMap(newMap);
            shouldRetrieveMap.current = false;
        })()
    }, [map, shouldRetrieveMap.current]);

    useEffect(() => {
        if(isQClicked) {
            shiftMapByAxis('y', true);
        }
        else if(isDClicked) {
            shiftMapByAxis('y', false);
        }
        else if(isWClicked) {
            shiftMapByAxis('x', true);
        }
        else if(isSClicked) {
            shiftMapByAxis('x', false);
        }
        else if(isAClicked) {
            shiftMapByAxis('z', true);
        }
        else if(isEClicked) {
            shiftMapByAxis('z', false);
        }

    }, [isQClicked, isWClicked, isEClicked, isAClicked, isSClicked, isDClicked]);

    return map;
}
