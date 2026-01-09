/**
 * Tipo que representa una celda del mapa de la ciudad.
 * Contiene la posición y el tipo de edificio (si existe).
 */
export type CityTile = {
  x: number;
  y: number;
  building: undefined | "building-1" | "building-2" | "building-3";
  update: VoidFunction;
};

export class City {
  public data: CityTile[][];
  public size: number;

  constructor(size: number) {
    this.size = size;
    this.data = this.intializeData();
  }

  public intializeData(): CityTile[][] {
    const data: CityTile[][] = [];
    for (let x = 0; x < this.size; x++) {
      const column: CityTile[] = [];
      for (let y = 0; y < this.size; y++) {
        const tile: CityTile = {
          x,
          y,
          building: undefined,
          update() {
            const x = Math.random();
            if (x < 0.01) {
              if (this.building === undefined) {
                tile.building = "building-1";
              } else if (this.building === "building-1") {
                tile.building = "building-2";
              } else if (this.building === "building-2") {
                this.building = "building-3";
              }
            }
          },
        };

        column.push(tile);
      }
      data.push(column);
    }
    return data;
  }

  public update() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        this.data[x][y].update();
      }
    }
  }
}
