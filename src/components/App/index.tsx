import React, {useEffect, useState} from "react"
// @ts-ignore
import { HexGrid, Layout, Hexagon, Text, GridGenerator } from "react-hexgrid";
import {RNGService, Tile} from "../../services/RNGService";

export const App: React.FC = () => {
  const [_map, setMap] = useState<Tile[]>([]);

  const hexagons = GridGenerator.hexagon(1);

  useEffect(() => {
    // game init
    (async () => {
      const newMap = await RNGService.getMap([]);
      setMap(newMap);
    })()
  }, []);

  return <HexGrid width={1200} height={1000} spacing={1.1} >
    <Layout size={{ x: 6, y: 6 }}>
      { hexagons.map((hex: any, i: number) => <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} />) }
    </Layout>
  </HexGrid>;
}
