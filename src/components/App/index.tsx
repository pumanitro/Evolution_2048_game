import React from "react"
// @ts-ignore
import { HexGrid, Layout, Hexagon, Text, GridGenerator } from "react-hexgrid";
import {RNGService, Tile} from "../../services/RNGService";
import { useMap } from "./useMap";
import {getParams} from "./getParams";

export const getTileKey = (x: number, y: number, z: number) => {
  return `_${x},${y},${z}`;
}

export const App: React.FC = () => {
  const hexagons = GridGenerator.hexagon(getParams().radius ? getParams().radius - 1 : 1);
  const [map, gameStatus] = useMap(hexagons);

  // to optimize search for map tiles
  const indexedMap = map.reduce((acc: Record<string, Tile>, tile) => {
    const key = getTileKey(tile.x, tile.y, tile.z);
    acc[key] = tile;
    return acc;
  } ,{})

  return <>
    <div data-status={gameStatus}>Status: {gameStatus}</div>
      <HexGrid width={1200} height={1000}>
      <Layout size={{ x: 6, y: 6 }}>
        { hexagons.map((hex: any, i: number) => {
          const mapTile = indexedMap[getTileKey(hex.q, hex. r, hex.s)];
          return <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s}>{
              mapTile && mapTile.value !== 0 &&
              <Text>{mapTile.value}</Text>
          }</Hexagon>
        }) }
      </Layout>
    </HexGrid>
  </>;
}
