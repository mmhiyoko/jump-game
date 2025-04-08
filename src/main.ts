import { fail } from "./utils/fail";

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') ?? fail('Failed to get canvas context');

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "orange";
    ctx.fillRect(50, 300, 30, 30);

    requestAnimationFrame(gameLoop);
}

gameLoop();