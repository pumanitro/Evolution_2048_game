import axios from 'axios';

const BASE_URL = 'http://localhost:13337/';

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
        const resp = await axiosInstance.post('2', map);
        return resp.data;
    },
};
