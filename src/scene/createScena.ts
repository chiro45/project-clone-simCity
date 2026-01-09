import {
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import {
  CameraController,
  type CameraController as ICameraController,
} from "../camera/cameraController";
import {
  CreateCamera,
  type CreateCamera as ICreateCamera,
} from "../camera/createCamera";
import type { City } from "../city/city";

/**
 * Clase que gestiona la escena principal del juego.
 * Contiene la cámara, el renderer y todos los objetos 3D.
 */
export class CreateScene {
  public scene: Scene;
  private renderer: WebGLRenderer;
  private gameWindow: HTMLCanvasElement;
  private mesh: Mesh;
  private camera: ICreateCamera;
  private cameraController: ICameraController;
  private terrain: Mesh[][];
  private buildings: Mesh[][];

  constructor() {
    this.gameWindow = document.getElementById(
      "render-target"
    ) as HTMLCanvasElement;
    this.terrain = [];
    this.buildings = [];
    // Crear cámara
    this.camera = new CreateCamera(this.gameWindow);

    // Crear controlador de cámara (maneja eventos del mouse)
    this.cameraController = new CameraController(this.camera);

    // Crear escena
    this.scene = new Scene();
    this.scene.background = new Color(0x777777);
    // Crear renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(
      this.gameWindow.offsetWidth,
      this.gameWindow.offsetHeight
    );
    this.gameWindow.appendChild(this.renderer.domElement);

    // Crear un cubo de prueba
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0xf00000 });
    this.mesh = new Mesh(geometry, material);
    this.scene.add(this.mesh);
  }
  public initializeCity(city: City) {
    this.scene.clear();
    this.terrain = [];

    for (let x = 0; x < city.size; x++) {
      const column: Mesh[] = [];
      for (let y = 0; y < city.size; y++) {
        //grass geometry
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshLambertMaterial({ color: 0x00ff00 });
        const mesh = new Mesh(geometry, material);
        mesh.position.set(x, -0.5, y);
        this.scene.add(mesh);
        column.push(mesh);
      }
      this.terrain.push(column);
      this.buildings.push([...Array(city.size)]);
    }
  }

  public update(city: City) {
    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        //building geometry
        const tile = city.data[x][y];
        if (tile?.building && tile.building.startsWith("building")) {
          const height = Number(tile.building.slice(-1));
          const buildingGeometry = new BoxGeometry(1, height, 1);
          const buildingMaterial = new MeshLambertMaterial({ color: 0x777777 });
          const buildingMesh = new Mesh(buildingGeometry, buildingMaterial);
          buildingMesh.position.set(x, height / 2, y);
          if (this.buildings[x][y]) {
            this.scene.remove(this.buildings[x][y]);
          }
          this.scene.add(buildingMesh);
          this.buildings[x][y] = buildingMesh;
        }
      }
    }
  }

  /**
   * Renderiza un frame de la escena.
   */
  private draw = () => {
    this.renderer.render(this.scene, this.camera.camera);
  };

  /**
   * Detiene la animación del render loop.
   */
  public stop = () => {
    this.renderer.setAnimationLoop(null);
    this.cameraController.destroy();
  };

  /**
   * Inicia el render loop que actualiza constantemente la escena.
   */
  public start = () => {
    this.renderer.setAnimationLoop(this.draw);
  };
}
