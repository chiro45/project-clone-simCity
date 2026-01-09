import { PerspectiveCamera, Vector3 } from "three";

/**
 * Clase que gestiona la cámara de la escena.
 * Solo se encarga de la posición, rotación y zoom de la cámara.
 * Los eventos del mouse se manejan en CameraController.
 */
export class CreateCamera {
	// Ángulos de la cámara en grados
	private cameraAzimuth: number; // Rotación horizontal
	private cameraElevation: number; // Rotación vertical
	private cameraRadius: number; // Distancia desde el origen

	// Punto focal de la cámara
	private cameraOrigin: Vector3;

	// Límites de movimiento
	private readonly MIN_CAMERA_ELEVATION: number = 30;
	private readonly MAX_CAMERA_ELEVATION: number = 90;
	private readonly MIN_CAMERA_RADIUS: number = 2;
	private readonly MAX_CAMERA_RADIUS: number = 10;

	// Sensibilidades de los controles
	private readonly ROTATION_SENSIVITY: number = 0.5;
	private readonly ZOOM_SENSIVITY: number = 0.02;
	private readonly PAN_SENSIVITY: number = -0.01;

	// Constantes
	private readonly Y_AXIS = new Vector3(0, 1, 0);
	private readonly DEG2RAD = Math.PI / 180;

	// Objeto de Three.js
	public camera: PerspectiveCamera;
	private gameWindow: HTMLCanvasElement;

	constructor(gameWindow: HTMLCanvasElement) {
		this.gameWindow = gameWindow;

		// Inicializar ángulos y posición
		this.cameraRadius = 4;
		this.cameraAzimuth = 0;
		this.cameraElevation = 0;
		this.cameraOrigin = new Vector3();

		// Crear la cámara perspectiva
		this.camera = new PerspectiveCamera(
			75,
			this.gameWindow.offsetWidth / this.gameWindow.offsetHeight,
			0.1,
			1000,
		);

		this.updateCameraPosition();
	}

	/**
	 * Rota la cámara alrededor del origen.
	 * deltaX - Cambio en el eje X (azimut)
	 *  deltaY - Cambio en el eje Y (elevación)
	 */
	public rotate = (deltaX: number, deltaY: number) => {
		this.cameraAzimuth += -deltaX * this.ROTATION_SENSIVITY;
		this.cameraElevation += deltaY * this.ROTATION_SENSIVITY;

		// Limitar el ángulo de elevación
		this.cameraElevation = Math.min(
			this.MAX_CAMERA_ELEVATION,
			Math.max(this.MIN_CAMERA_ELEVATION, this.cameraElevation),
		);

		this.updateCameraPosition();
	};

	/**
	 * Realiza zoom in/out de la cámara.
	 *  delta - Cambio en la distancia (positivo = zoom out, negativo = zoom in)
	 */
	public zoom = (delta: number) => {
		this.cameraRadius += delta * this.ZOOM_SENSIVITY;

		// Limitar el radio de la cámara
		this.cameraRadius = Math.min(
			this.MAX_CAMERA_RADIUS,
			Math.max(this.MIN_CAMERA_RADIUS, this.cameraRadius),
		);

		this.updateCameraPosition();
	};

	/**
	 * Desplaza el punto focal de la cámara (pan).
	 * deltaX - Cambio horizontal
	 * deltaY - Cambio vertical
	 */
	public pan = (deltaX: number, deltaY: number) => {
		// Calcular vectores de movimiento según la rotación actual

		const forward = new Vector3(0, 0, 1).applyAxisAngle(
			this.Y_AXIS,
			this.cameraAzimuth * this.DEG2RAD,
		);
		const left = new Vector3(1, 0, 0).applyAxisAngle(
			this.Y_AXIS,
			this.cameraAzimuth * this.DEG2RAD,
		);
		this.cameraOrigin.add(forward.multiplyScalar(this.PAN_SENSIVITY * deltaY));
		this.cameraOrigin.add(left.multiplyScalar(this.PAN_SENSIVITY * deltaX));

		this.updateCameraPosition();
	};

	/**
	 * Actualiza la posición de la cámara basada en los ángulos y radio.
	 * Usa coordenadas esféricas para calcular la posición final.
	 */
	private updateCameraPosition = () => {
		// Convertir coordenadas esféricas a cartesianas
		this.camera.position.x =
			this.cameraRadius *
			Math.sin(this.cameraAzimuth * this.DEG2RAD) *
			Math.cos(this.cameraElevation * this.DEG2RAD);

		this.camera.position.y =
			this.cameraRadius * Math.sin(this.cameraElevation * this.DEG2RAD);

		this.camera.position.z =
			this.cameraRadius *
			Math.cos(this.cameraAzimuth * this.DEG2RAD) *
			Math.cos(this.cameraElevation * this.DEG2RAD);

		// Hacer que la cámara mire al origen
		this.camera.lookAt(this.cameraOrigin);
		this.camera.updateMatrix();
	};
}
