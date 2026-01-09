import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";

type typeId = "grass" | "building-1" | "building-2" | "building-3";

interface IAssets {
  [key: string]: (x: number, y: number) => Mesh;
}

export class Assets {
  public assets: IAssets;
  private readonly BOX_GEOMETRY: BoxGeometry = new BoxGeometry(1, 1, 1);

  constructor() {
    this.assets = {
      "grass": (x: number, y: number) => {
        //grass geometry
        const material = new MeshLambertMaterial({ color: 0x00ff00 });
        const mesh = new Mesh(this.BOX_GEOMETRY, material);
        mesh.userData = { id: "grass",x,y };
        mesh.position.set(x, -0.5, y);
        return mesh;
      },
      "building-1": (x: number, y: number) => {
        const material = new MeshLambertMaterial({ color: 0xf00666 });
        const mesh = new Mesh(this.BOX_GEOMETRY, material);
        mesh.userData = { id: "building-1",x,y };
        mesh.position.set(x, 0.5, y);
        return mesh;
      },
      "building-2": (x: number, y: number) => {
        const geometry = new BoxGeometry(1, 2, 1);
        const material = new MeshLambertMaterial({ color: 0xfeaa });
        const mesh = new Mesh(geometry, material);
        mesh.userData = { id: "building-2", x, y };
        mesh.scale.set(1, 2, 1);
        mesh.position.set(x, 1, y);
        return mesh;
      },
      "building-3": (x: number, y: number) => {
        const geometry = new BoxGeometry(1, 3, 1);
        const material = new MeshLambertMaterial({ color: 0x777777 });
        const mesh = new Mesh(geometry, material);
        mesh.userData = { id: "building-3", x, y };
        mesh.scale.set(1, 3, 1);
        mesh.position.set(x, 1.5, y);
        return mesh;
      },
    };
  }

  public createAssetInstance(
    assetId: typeId | undefined,
    x: number,
    y: number
  ): Mesh | undefined {
    if (!assetId || !(assetId in this.assets)) {
      console.log(`Asset Id ${assetId} is not found`);
      return undefined;
    }
    return this.assets[assetId](x, y);
  }
}
