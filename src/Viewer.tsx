import { useEffect, useState } from "react";
import { Context } from "./context";
import { Plugin } from "molstar/lib/mol-plugin-ui/plugin";
import { PrimitivesData, Sphere } from "./primitives";
import { ColorGenerator } from "molstar/lib/extensions/meshes/mesh-utils";

export type ResidueKey = {
  labelCompId: string;
  labelSeqId: number;
  labelChainId: string;
};

export function Viewer({ context }: { context: Context }) {
  const [channels, setChannels] = useState<PrimitivesData[]>([
    [],
  ]);

  const pdbids = ["1ymg", "5mrw", "4nm9", "1jj2", "3tbg"];
  const pdbid = pdbids[0];

  useEffect(() => {
    async function fetchSpheres() {
      const response = await fetch(
        `https://channelsdb2.biodata.ceitec.cz/api/channels/pdb/${pdbid}`
      );
      const json = await response.json();
      const channels: PrimitivesData[] = [];
      let id = 0;
      json.Channels.ReviewedChannels_MOLE.forEach((channel: any, i: any) => {
        const color = ColorGenerator.next().value;
        const c: Sphere[] = [];
        for (let j = 0; j < channel.Profile.length; j += 1) {
          const entry = channel.Profile[j];
          c.push({
            kind: "sphere",
            center: [entry.X, entry.Y, entry.Z],
            radius: entry.Radius,
            color,
            label: `${json.Annotations[0].Name} ${json.Annotations[0].Id}`,
            group: i,
            id: id,
          });

          id += 1;
        }
        channels.push(c);
      });
      setChannels(channels);
    }

    fetchSpheres();
    context.load(`https://files.rcsb.org/view/${pdbid}.cif`);
  }, []);

  channels.forEach((channel) => {
    context.renderSpheres(channel);
  });

  return (
    <div
      className=""
      style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          // inset: "100px 0px 0px 100px",
          position: "relative",
          height: "500px",
          width: "800px",
        }}
      >
        <Plugin plugin={context.plugin} />
      </div>
    </div>
  );
}
