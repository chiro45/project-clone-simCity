import {
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Scene,
  Vector2,
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
import { Assets, type Assets as IAssets } from "../assets/assets";

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
  private assets: IAssets;
  private raycaster: Raycaster;
  private mouseVector: Vector2;
  private selectedObject: Mesh | undefined;
  private terrain: Mesh[][];
  private buildings: (Mesh | undefined)[][];

  constructor() {
    this.gameWindow = document.getElementById(
      "render-target"
    ) as HTMLCanvasElement;
    this.terrain = [];
    this.buildings = [];
    this.assets = new Assets();
    this.raycaster = new Raycaster();
    this.mouseVector = new Vector2();
    this.selectedObject = undefined;
    // Crear cámara
    this.camera = new CreateCamera(this.gameWindow);
    // Crear escena
    this.scene = new Scene();
    this.scene.background = new Color(0x777777);
    // Crear renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(
      this.gameWindow.offsetWidth,
      this.gameWindow.offsetHeight
    );
    // Crear controlador de cámara (maneja eventos del mouse)
    this.cameraController = new CameraController(
      this.camera,
      this.mouseVector,
      this.renderer,
      this.raycaster,
      this.scene,
      this.selectedObject
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
        const terrainId = city.data[x][y].terrainId;
        const mesh = this.assets.createAssetInstance(terrainId, x, y);
        if (mesh) {
          this.scene.add(mesh);
          column.push(mesh);
        }
      }
      this.terrain.push(column);
      this.buildings.push([...Array(city.size)]);
    }
  }

  public update(city: City) {
    
    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        const currentBuildingId = this.buildings[x][y]?.userData.id;
        const newBuildingId = city.data[x][y].buildingId;

        //if the player removes a building remove from the scene
        if (!newBuildingId && currentBuildingId) {
          this.scene.remove(this.buildings[x][y]!);
          this.buildings[x][y] = undefined;
        }

        if (newBuildingId !== currentBuildingId) {
          this.scene.remove(this.buildings[x][y]!);

          this.buildings[x][y] = this.assets.createAssetInstance(
            newBuildingId,
            x,
            y
          );

          this.scene.add(this.buildings[x][y]!);
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
