import type { Raycaster, Scene, Vector2, WebGLRenderer } from "three";
import type { CreateCamera } from "./createCamera";

/**
 * Controlador de cámara que maneja todos los eventos del mouse.
 * Se encarga de traducir los eventos del mouse en comandos de movimiento
 * para la cámara.
 */
export class CameraController {
	// Referencia a la cámara
	private camera: CreateCamera;

	// Estado de los botones del mouse
	private isLeftMouseDown: boolean = false;
	private isRightMouseDown: boolean = false;
	private isMiddleMouseDown: boolean = false;

	// Posición anterior del mouse (para calcular deltas)
	private prevMouseX: number = 0;
	private prevMouseY: number = 0;

	// Constantes de botones del mouse
	private readonly LEFT_MOUSE_BUTTON: number = 0;
	private readonly MIDDLE_MOUSE_BUTTON: number = 1;
	private readonly RIGHT_MOUSE_BUTTON: number = 2;
	private mousePosition: Vector2;
	private renderer: WebGLRenderer;
	private raycaster: Raycaster;
	public selectedObject: any;
	public scene: Scene;
	constructor(
		camera: CreateCamera,
		mousePosition: Vector2,
		renderer: WebGLRenderer,
		raycaster: Raycaster,
		scene: Scene,
		selectedObject: any,
	) {
		this.camera = camera;
		this.mousePosition = mousePosition;
		this.renderer = renderer;
		this.raycaster = raycaster;
		this.scene = scene;
		this.selectedObject = selectedObject;
		// Registrar eventos del mouse
		window.addEventListener("mousedown", this.onMouseDown.bind(this.scene));
		window.addEventListener("mouseup", this.onMouseUp.bind(this.scene));
		window.addEventListener("mousemove", this.onMouseMove.bind(this.scene));

		// Prevenir menú contextual del click derecho
		document.addEventListener("contextmenu", (e) => e.preventDefault());
	}

	/**
	 * Maneja el evento mousedown.
	 * Detecta qué botón fue presionado y lo registra.
	 */

	public changeStateMouse = (button: number, newState: boolean) => {
		switch (button) {
			case this.LEFT_MOUSE_BUTTON:
				this.isLeftMouseDown = newState;

				return;
			case this.RIGHT_MOUSE_BUTTON:
				this.isRightMouseDown = newState;

				return;
			case this.MIDDLE_MOUSE_BUTTON:
				this.isMiddleMouseDown = newState;
				return;

			default:
				return;
		}
	};
	private onMouseDown = (event: MouseEvent) => {
		event.preventDefault();

		this.changeStateMouse(event.button, true);

		this.mousePosition.x =
			(event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
		this.mousePosition.y =
			-(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.mousePosition, this.camera.camera);

		const intersections = this.raycaster.intersectObjects(
			this.scene.children,
			false,
		);

		if (intersections.length > 0) {
			if (this.selectedObject) {
				this.selectedObject.material.emissive.setHex(0);
			}
			this.selectedObject = intersections[0].object;
			this.selectedObject.material.emissive.setHex(0x555555);
		}

		// Guardar posición inicial del mouse
		this.prevMouseX = event.clientX;
		this.prevMouseY = event.clientY;
	};

	/**
	 * Maneja el evento mouseup.
	 * Detecta qué botón fue soltado y lo registra.
	 */
	private onMouseUp = (event: MouseEvent) => {
		event.preventDefault();

		this.changeStateMouse(event.button, false);
	};

	/**
	 * Maneja el evento mousemove.
	 * Calcula el delta del movimiento y lo aplica a los controles activos.
	 */
	private onMouseMove = (event: MouseEvent) => {
		const deltaX = event.clientX - this.prevMouseX;
		const deltaY = event.clientY - this.prevMouseY;

		// Click izquierdo: Rotar cámara
		if (this.isLeftMouseDown) {
			this.camera.rotate(deltaX, deltaY);
		}

		// Click derecho: Zoom
		if (this.isRightMouseDown) {
			this.camera.zoom(deltaY);
		}

		// Click central: Pan (desplazar punto focal)
		if (this.isMiddleMouseDown) {
			this.camera.pan(deltaX, deltaY);
		}

		// Actualizar posición anterior para el próximo frame
		this.prevMouseX = event.clientX;
		this.prevMouseY = event.clientY;
	};

	/**
	 * Destruye el controlador y remueve los event listeners.
	 * Llamar cuando ya no se necesite el controlador.
	 */
	public destroy() {
		window.removeEventListener("mousedown", this.onMouseDown);
		window.removeEventListener("mouseup", this.onMouseUp);
		window.removeEventListener("mousemove", this.onMouseMove);
	}
}
