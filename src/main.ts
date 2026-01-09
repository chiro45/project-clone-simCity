import { CreateGame } from "./game/createGame";
import "./style.css";

const game = new CreateGame();

game.startGame();

setInterval(() => {
	game.update();
}, 1000);
