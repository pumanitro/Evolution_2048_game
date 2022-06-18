import React, { useEffect, useState } from "react";
import {useKeyPress} from "./useKeyPress";

export const useMap = () => {
    const [map, setMap] = useState();

    const isQClicked = useKeyPress('q');
    const isWClicked = useKeyPress('w');
    const isEClicked = useKeyPress('e');
    const isAClicked = useKeyPress('a');
    const isSClicked = useKeyPress('s');
    const isDClicked = useKeyPress('d');

    useEffect(() => {


    }, [isQClicked, isWClicked, isEClicked, isAClicked, isSClicked, isDClicked]);

    return map;
}
