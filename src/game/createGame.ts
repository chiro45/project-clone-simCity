import { City, type City as ICity } from "../city/city";
import { type Lights as ILights, Lights } from "../lights/lights";
import {
	CreateScene,
	type CreateScene as ICreateScene,
} from "../scene/createScena";

export class CreateGame {
	private scene: ICreateScene;
	private city: ICity;
	private lights: ILights;
	constructor() {
		// Crear y iniciar la escena
		this.scene = new CreateScene();
		this.city = new City(16);

		this.scene.initializeCity(this.city);

		this.lights = new Lights(this.scene);
		this.lights.setUpLights();
	}
	public update() {
		this.city.update();
		this.scene.update(this.city);
	}
	public startGame() {
		this.scene.start();
	}
}
