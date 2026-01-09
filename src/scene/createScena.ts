import {
	BoxGeometry,
	Color,
	Mesh,
	MeshBasicMaterial,
	Scene,
	WebGLRenderer,
} from "three";
import { CameraController } from "../camera/cameraController";
import { CreateCamera } from "../camera/createCamera";

/**
 * Clase que gestiona la escena principal del juego.
 * Contiene la cámara, el renderer y todos los objetos 3D.
 */
export class CreateScene {
	private scene: Scene;
	private renderer: WebGLRenderer;
	private gameWindow: HTMLCanvasElement;
	private mesh: Mesh;
	private camera: CreateCamera;
	private cameraController: CameraController;

	constructor() {
		this.gameWindow = document.getElementById(
			"render-target",
		) as HTMLCanvasElement;

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
			this.gameWindow.offsetHeight,
		);
		this.gameWindow.appendChild(this.renderer.domElement);

		// Crear un cubo de prueba
		const geometry = new BoxGeometry(1, 1, 1);
		const material = new MeshBasicMaterial({ color: 0xf00000 });
		this.mesh = new Mesh(geometry, material);
		this.scene.add(this.mesh);
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
