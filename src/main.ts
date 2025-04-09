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

// Define constants for frame-related values
const FRAME_CONFIG = {
    CAT_WALK_FRAMES: 4,
    FRAME_WIDTH: 512,
    FRAME_HEIGHT: 512,
    FRAMES_PER_ROW: 2,
    FRAME_DURATION: 6,
};

// Initialize cat walk image
const catWalkImage = new Image();
catWalkImage.src = import.meta.env.BASE_URL + "/cat_walk.png";

// Refactor event listener into a separate function
function handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space' && catState.jumpCount < GAME.cat.maxJumpCount) {
        const isFirstJump = catState.jumpCount === 0;
        const jumpPower = isFirstJump ? GAME.cat.jumpAbsolutePower : GAME.cat.jumpAbsolutePower * GAME.cat.secondJumpMultiplier;
        catState.velocity = -jumpPower;
        catState.jumpCount++;
    }
}
window.addEventListener('keydown', handleKeyDown);

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

let walkFrame = 0;
let frameCount = 0;

// Refactor ground drawing into a separate function
function drawGround(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#444";
    ctx.fillRect(2, GAME.groundY, canvas.width, 10);
}

// Refactor cat drawing into a separate function
function drawCat(ctx: CanvasRenderingContext2D, catState: CatState, frame: number) {
    const col = frame % FRAME_CONFIG.FRAMES_PER_ROW;
    const row = Math.floor(frame / FRAME_CONFIG.FRAMES_PER_ROW);

    ctx.drawImage(
        catWalkImage,
        col * FRAME_CONFIG.FRAME_WIDTH, row * FRAME_CONFIG.FRAME_HEIGHT, // sx, sy
        FRAME_CONFIG.FRAME_WIDTH, FRAME_CONFIG.FRAME_HEIGHT, // sw, sh
        catState.x, catState.y,
        GAME.cat.size.width, GAME.cat.size.height,
    );
}

// Refactor game loop logic
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    catState = updateCatState(catState);

    frameCount++;
    if (frameCount >= FRAME_CONFIG.FRAME_DURATION) {
        walkFrame = (walkFrame + 1) % FRAME_CONFIG.CAT_WALK_FRAMES;
        frameCount = 0;
    }

    drawCat(ctx, catState, walkFrame);
    drawGround(ctx);

    requestAnimationFrame(gameLoop);
}

// Start the game loop when the image is loaded
catWalkImage.onload = () => {
    gameLoop();
};