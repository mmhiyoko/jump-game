import { fail } from "./utils/fail";
import { GAME } from "./config";

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') ?? fail('Failed to get canvas context');

type CatState = {
    x: number;
    y: number;
    velocity: number;
    jumpCount: number;
}

let catState: CatState = {
    x: GAME.cat.initialPosition.x,
    y: GAME.cat.initialPosition.y,
    velocity: 0,
    jumpCount: 0,
};

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && catState.jumpCount < GAME.cat.maxJumpCount) {
        catState.velocity = -GAME.jumpAbsolutePower;
        catState.jumpCount++;
    }
});

function updateCatState(catState: CatState): CatState {
    let newVelocity = catState.velocity + GAME.gravity;
    let newY = catState.y + newVelocity;
    let newJumpCount = catState.jumpCount;

    if (newY > GAME.groundY) {
        newY = GAME.groundY;
        newVelocity = 0;
        newJumpCount = 0;
    }

    return { x: catState.x, y: newY, velocity: newVelocity, jumpCount: newJumpCount };
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    catState = updateCatState(catState);

    ctx.fillStyle = GAME.cat.color;
    ctx.fillRect(catState.x, catState.y, GAME.cat.size.width, GAME.cat.size.height);

    requestAnimationFrame(gameLoop);
}

gameLoop();