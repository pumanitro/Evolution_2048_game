import axios from 'axios';
import {getParams} from "../components/App/getParams";

const DEFAULT_PORT = 80;

const BASE_URL = getParams().hostname ? `${getParams().hostname}:${getParams().port || DEFAULT_PORT}/` : 'http://localhost:13337/';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export type Tile = {
    x: number,
    y: number,
    z: number,
    value: number,
}

export const RNGService = {
    getMap: async (map: Tile[]) => {
        const resp = await axiosInstance.post(getParams().radius || '2', map);
        return resp.data;
    },
};
