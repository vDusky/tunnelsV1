import { Mesh } from "molstar/lib/mol-geo/geometry/mesh/mesh";
import { Vec3 } from "molstar/lib/mol-math/linear-algebra";
import { Shape } from "molstar/lib/mol-model/shape";
import { PluginStateObject } from "molstar/lib/mol-plugin-state/objects";
import { StateTransformer } from "molstar/lib/mol-state";
import { Color } from "molstar/lib/mol-util/color";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { MeshBuilder } from "molstar/lib/mol-geo/geometry/mesh/mesh-builder";
import { addSphere } from "molstar/lib/mol-geo/geometry/mesh/builder/sphere";
import { WebGLContext } from "molstar/lib/mol-gl/webgl/context";

export type Sphere = {
  kind: "sphere";
  center: number[];
  radius: number;
  label: string;
  color: number;
  group: number;
  id: number;
};

export type PrimitivesData = Sphere[];

const Transform = StateTransformer.builderFactory("namespace-id");
export const CreateSpheresProvider = Transform({
  name: "name-id",
  display: { name: "name" },
  from: PluginStateObject.Root,
  to: PluginStateObject.Shape.Provider,
  params: {
    data: PD.Value<PrimitivesData>([], { isHidden: false }),
    webgl: PD.Value<WebGLContext | null>(null),
  },
})({
  apply({ params }) {
    return new PluginStateObject.Shape.Provider({
      label: "Channel",
      data: params,
      params: Mesh.Params,
      geometryUtils: Mesh.Utils,
      getShape: (_, data) => createSpheresShape(data.data, data.webgl),
    });
  },
});

async function createSpheresShape(data: PrimitivesData, webgl: WebGLContext) {
  const builder = MeshBuilder.createState(512, 512);

  for (let i = 0; i < data.length; i += 1) {
    const p = data[i];
    builder.currentGroup = p.group;
    addSphere(builder, p.center as Vec3, p.radius, 2);
    }

  const mesh = MeshBuilder.getMesh(builder);

  return Shape.create(
    "Sheres",
    {},
    mesh,
    (g) => Color(data[g].color),
    // () => Color(0xff0000),
    () => 1,
    (g) => data[g].label
  );
}
