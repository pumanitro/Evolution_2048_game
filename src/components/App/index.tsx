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
      <HexGrid width={500} height={500}>
      <Layout size={{ x: 12, y: 12 }}>
        { hexagons.map((hex: any, i: number) => {
          const mapTile = indexedMap[getTileKey(hex.q, hex. s, hex.r)];
          return <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s}>
            <>
              {
                mapTile && mapTile.value !== 0 &&
                <Text>{mapTile.value}</Text>
              }
              {
                mapTile && <span data-x={hex.q} data-y={hex.s} data-z={hex.r} data-value={mapTile.value} />
              }
          </>
          </Hexagon>
        }) }
      </Layout>
    </HexGrid>
  </>;
}
