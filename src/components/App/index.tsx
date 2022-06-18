import React, {useEffect, useState} from "react"
// @ts-ignore
import { HexGrid, Layout, Hexagon, Text, GridGenerator } from "react-hexgrid";
import {RNGService, Tile} from "../../services/RNGService";

const getTileKey = (x: number, y: number, z: number) => {
  return `_${x},${y},${z}`;
}

export const App: React.FC = () => {
  const [map, setMap] = useState<Tile[]>([]);

  const hexagons = GridGenerator.hexagon(1);

  useEffect(() => {
    // game init
    (async () => {
      const newMapData = await RNGService.getMap([]);
      let newIndexedMap = hexagons.reduce((acc: Record<string, Tile>, hex: any) => {
        acc[getTileKey(hex.q, hex.r, hex.s)] = {
          x: hex.q,
          y: hex.r,
          z: hex.s,
          value: 0,
        }
        return acc;
      }, {});

      newMapData.forEach((tile: Tile) => {
        newIndexedMap[getTileKey(tile.x, tile.y, tile.z)] = tile;
      });

      const newMap = Object.values(newIndexedMap) as Tile[];
      setMap(newMap);
    })()
  }, []);

  // to optimize search for map tiles
  const indexedMap = map.reduce((acc: Record<string, Tile>, tile) => {
    const key = getTileKey(tile.x, tile.y, tile.z);
    acc[key] = tile;
    return acc;
  } ,{})

  return <HexGrid width={1200} height={1000}>
    <Layout size={{ x: 6, y: 6 }}>
      { hexagons.map((hex: any, i: number) => {
        const mapTile = indexedMap[getTileKey(hex.q, hex. r, hex.s)];
        return <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s}>{
            mapTile && mapTile.value !== 0 &&
            <Text>{mapTile.value}</Text>
        }</Hexagon>
      }) }
    </Layout>
  </HexGrid>;
}
