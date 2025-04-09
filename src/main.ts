import { fail } from "./utils/fail";
import { GAME } from "./config";

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') ?? fail('Failed to get canvas context');

type CatState = {
    x: number;
    y: number;
    velocity: number;
    jumpCount: number;
    color: string;
}

let catState: CatState = {
    x: GAME.cat.initialPosition.x,
    y: GAME.cat.initialPosition.y,
    velocity: 0,
    jumpCount: 0,
    color: GAME.cat.initialColor,
};

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && catState.jumpCount < GAME.cat.maxJumpCount) {
        const isFirstJump = catState.jumpCount === 0;
        const jumpPower = isFirstJump ? GAME.cat.jumpAbsolutePower : GAME.cat.jumpAbsolutePower * GAME.cat.secondJumpMultiplier;
        catState.velocity = - jumpPower;
        catState.jumpCount++;
    }
});

function updateCatState(catState: CatState): CatState {
    let newVelocity = catState.velocity + GAME.gravity;
    let newY = catState.y + newVelocity;
    let newJumpCount = catState.jumpCount;

    if (newY > GAME.groundY - GAME.cat.size.height + 4) {
        newY = GAME.groundY - GAME.cat.size.height + 4;
        newVelocity = 0;
        newJumpCount = 0;
    }

    return {
        x: catState.x,
        y: newY,
        velocity: newVelocity,
        jumpCount: newJumpCount,
        color: (newJumpCount == 2) ? "red" : GAME.cat.initialColor,
    };
}

const CAT_WALK_FRAMES = 4;
const FRAME_WIDTH = 512;
const FRAME_HEIGHT = 512;
const FRAMES_PER_ROW = 2;
const FRAME_DURATION = 6;
const catWalkImage = new Image();
catWalkImage.src = import.meta.env.BASE_URL + "/cat_walk.png";

let walkFrame = 0;
let frameCount = 0;

function drawGround(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#444";
    ctx.fillRect(2, GAME.groundY, canvas.width, 10);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    catState = updateCatState(catState);

    frameCount++;
    if (frameCount >= FRAME_DURATION) {
        walkFrame = (walkFrame + 1) % CAT_WALK_FRAMES;
        frameCount = 0;
    }

    // 行・列からフレーム位置を計算
    const col = walkFrame % FRAMES_PER_ROW;
    const row = Math.floor(walkFrame / FRAMES_PER_ROW);

    ctx.drawImage(
        catWalkImage,
        col * FRAME_WIDTH, row * FRAME_HEIGHT, // sx, sy
        FRAME_WIDTH, FRAME_HEIGHT, // sw, sh
        catState.x, catState.y,
        GAME.cat.size.width, GAME.cat.size.height,
    )

    drawGround(ctx);

    requestAnimationFrame(gameLoop);
}

catWalkImage.onload = () => {
    gameLoop();
}