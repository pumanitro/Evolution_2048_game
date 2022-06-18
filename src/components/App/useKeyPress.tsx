import {useEffect, useState } from "react";

type Listener = (this:Window, ev: KeyboardEvent) => any;

export const useKeyPress = (targetKey: string) => {
    const [keyPressed, setKeyPressed] = useState(false);

    const downHandler: Listener = ({ key }) => {
        if (key === targetKey) setKeyPressed(true);
    };

    const upHandler: Listener = ({ key }) => {
        if (key === targetKey) setKeyPressed(false);
    };

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    return keyPressed;
};
