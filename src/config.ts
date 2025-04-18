export const GAME = {
    gravity: 0.5,
    cat: {
        size: { width: 64, height: 64 },
        initialPosition: { x: 50, y: 300 },
        jumpAbsolutePower: 15,
        secondJumpMultiplier: 0.7,
        maxJumpCount: 2,
        initialColor: "orange",
    },
    canvas: {
        width: 480,
        height: 640,
    },
    ground: {
        height: 64,
    },
    get groundY() {
        // 地面のY座標（canvas高さ - 猫の高さ）
        return this.canvas.height - this.ground.height;
    },
} as const;
