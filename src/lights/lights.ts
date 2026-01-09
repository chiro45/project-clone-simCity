import { AmbientLight, DirectionalLight } from "three";
import type { CreateScene } from "../scene/createScena";

export class Lights {
	private lights: (AmbientLight | DirectionalLight)[];
	private scene: CreateScene;
	constructor(scene: CreateScene) {
		this.scene = scene;
		this.lights = [
			new AmbientLight(0xffffff, 0.2),
			new DirectionalLight(0xffffff, 0.3),
			new DirectionalLight(0xffffff, 0.3),
			new DirectionalLight(0xffffff, 0.3),
		];
	}

	public setUpLights() {
		this.lights[1].position.set(0, 1, 0);
		this.lights[2].position.set(1, 1, 0);
		this.lights[3].position.set(0, 1, 1);
		this.scene.scene.add(...this.lights);
	}
}
