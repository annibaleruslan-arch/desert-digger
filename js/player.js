class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 22;
        this.h = 40;
        this.speed = 4;
        this.dir = 1;
        this.animTimer = 0;
        this.isMoving = false;
    }

    update(dir) {
        if (dir !== 0) {
            this.x += dir * this.speed;
            this.dir = dir;
            this.isMoving = true;
            this.animTimer += 0.2;
            
            if (Math.random() < 0.3) {
                particles.push({
                    x: this.x + (this.dir === 1 ? 0 : this.w),
                    y: this.y + this.h,
                    vx: -this.dir * (Math.random() * 1.5),
                    vy: -Math.random() * 1.5,
                    size: 2 + Math.random() * 2,
                    alpha: 1,
                    color: '#d35400'
                });
            }
        } else {
            this.isMoving = false;
            this.animTimer = 0;
        }
    }

    render(ctx, camX) {
        let px = canvas.width / 2 - this.w / 2;
        let legOffset = Math.sin(this.animTimer) * 4;

        // Ноги с анимацией
        ctx.fillStyle = '#111';
        ctx.fillRect(px + 2, this.y + 32 + (this.isMoving ? legOffset : 0), 6, 8);
        ctx.fillRect(px + 14, this.y + 32 + (this.isMoving ? -legOffset : 0), 6, 8);

        // Штаны
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(px + 2, this.y + 20, 18, 13);
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(px + 4, this.y + 24, 4, 4);

        // Куртка
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(px, this.y + 8, this.w, 12);
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(px + 10, this.y + 8, 2, 12);

        // Голова
        ctx.fillStyle = '#ffcc80';
        ctx.fillRect(px + 2, this.y - 2, 18, 10);

        // Глаза
        ctx.fillStyle = '#000';
        let eyeOffset = this.dir === 1 ? 3 : 0;
        ctx.fillRect(px + 4 + eyeOffset, this.y + 1, 3, 3);
        ctx.fillRect(px + 11 + eyeOffset, this.y + 1, 3, 3);

        // Кепка
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(px, this.y - 6, 22, 5);
        ctx.fillRect(this.dir === 1 ? px + 10 : px - 4, this.y - 4, 14, 3);
    }
}
