export const GAME = {
    gravity: 0.5,
    jumpAbsolutePower: 10,
    cat: {
        size: { width: 50, height: 50 },
        initialPosition: { x: 50, y: 300 },
        color: "orange",
    },
    canvas: {
        width: 480,
        height: 640,
    },
    get groundY() {
        // 地面のY座標（canvas高さ - 猫の高さ）
        return this.canvas.height - this.cat.size.height;
    },
};
