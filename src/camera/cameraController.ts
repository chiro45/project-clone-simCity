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

	constructor(camera: CreateCamera) {
		this.camera = camera;

		// Registrar eventos del mouse
		window.addEventListener("mousedown", this.onMouseDown);
		window.addEventListener("mouseup", this.onMouseUp);
		window.addEventListener("mousemove", this.onMouseMove);

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
