import { fail } from "./utils/fail";
import { GAME } from "./config";

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') ?? fail('Failed to get canvas context');

type CatState = {
    x: number;
    y: number;
    velocity: number;
}

let catState: CatState = {
    x: GAME.cat.initialPosition.x,
    y: GAME.cat.initialPosition.y,
    velocity: 0,
};

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        catState.velocity = -GAME.jumpAbsolutePower;
    }
});

function updateCatPosition(catState: CatState): CatState {
    let newVelocity = catState.velocity + GAME.gravity;
    let newY = catState.y + newVelocity;

    if (newY > GAME.groundY) {
        newY = GAME.groundY;
        newVelocity = 0;
    }

    return { x: catState.x, y: newY, velocity: newVelocity };
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    catState = updateCatPosition(catState);

    ctx.fillStyle = GAME.cat.color;
    ctx.fillRect(catState.x, catState.y, GAME.cat.size.width, GAME.cat.size.height);

    requestAnimationFrame(gameLoop);
}

gameLoop();