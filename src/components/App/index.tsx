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
      const newMap = await RNGService.getMap([]);
      setMap(newMap);
    })()
  }, []);

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
            mapTile &&
            <Text>{mapTile.value}</Text>
        }</Hexagon>
      }) }
    </Layout>
  </HexGrid>;
}
