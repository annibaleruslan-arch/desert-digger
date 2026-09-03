let worldRocks = [];
let mountains = [];
let particles = [];
let generatedMinX = 0;
let generatedMaxX = 0;

function expandWorld(minX, maxX, playerY) {
    if (minX < generatedMinX) {
        for (let x = minX; x < generatedMinX; x += 1200 + Math.random() * 600) {
            if (Math.random() < 0.4) mountains.push({ x: x, width: 280 + Math.random() * 120, height: 100 + Math.random() * 80 });
        }
        for (let x = minX; x < generatedMinX; x += 250 + Math.random() * 300) {
            if (Math.abs(x) > 200) spawnRock(x, playerY);
        }
        generatedMinX = minX;
    }

    if (maxX > generatedMaxX) {
        for (let x = generatedMaxX; x < maxX; x += 1200 + Math.random() * 600) {
            if (Math.random() < 0.4) mountains.push({ x: x, width: 280 + Math.random() * 120, height: 100 + Math.random() * 80 });
        }
        for (let x = generatedMaxX; x < maxX; x += 250 + Math.random() * 300) {
            if (Math.abs(x) > 200) spawnRock(x, playerY);
        }
        generatedMaxX = maxX;
    }
}

function spawnRock(xPos, playerY) {
    let rand = Math.random() * 100;
    let cum = 0;
    let base = ROCKS_DB[0];

    for (let r of ROCKS_DB) {
        cum += r.chance;
        if (rand <= cum) { base = r; break; }
    }

    let w = parseFloat((base.minW + Math.random() * (base.maxW - base.minW)).toFixed(3));
    let isDeep = Math.random() < 0.5;

    worldRocks.push({
        id: Math.random(),
        x: xPos,
        y: playerY + 12 + (isDeep ? 20 : 0),
        name: base.name,
        color: base.color,
        price: Math.round(base.price * (w / base.minW)),
        weight: w,
        isDeep: isDeep
    });
}

function renderWorld(ctx, player, gameState) {
    const camX = canvas.width / 2 - player.x;
    const groundY = player.y + player.h;

    // Небо
    let sky = ctx.createLinearGradient(0, 0, 0, groundY);
    sky.addColorStop(0, '#4a90e2');
    sky.addColorStop(0.7, '#87ceeb');
    sky.addColorStop(1, '#e0f7fa');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, groundY);

    // Горы
    ctx.fillStyle = '#b87333';
    for (let m of mountains) {
        let screenX = m.x + camX * 0.3;
        if (screenX > -m.width && screenX < canvas.width + m.width) {
            ctx.beginPath();
            ctx.moveTo(screenX - m.width / 2, groundY);
            ctx.lineTo(screenX, groundY - m.height);
            ctx.lineTo(screenX + m.width / 2, groundY);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Земля
    let depth = canvas.height - groundY;
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(0, groundY, canvas.width, 15);
    ctx.fillStyle = '#795548';
    ctx.fillRect(0, groundY + 15, canvas.width, depth - 15);

    // Лавка
    let shopX = camX;
    if (shopX > -100 && shopX < canvas.width + 100) {
        ctx.fillStyle = '#4a2c11';
        ctx.fillRect(shopX - 35, groundY - 50, 70, 50);
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(shopX - 18, groundY - 65, 36, 12);
        ctx.fillStyle = '#000';
        ctx.font = "6px 'Press Start 2P'";
        ctx.fillText("SHOP", shopX - 12, groundY - 57);
    }

    // Камни
    for (let r of worldRocks) {
        let rx = r.x + camX;
        if (rx > -30 && rx < canvas.width + 30) {
            if (!r.isDeep || gameState.hasDetector) {
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(rx - 7, r.y - 4, 14, 10);
                ctx.fillStyle = r.color;
                ctx.fillRect(rx - 6, r.y - 5, 12, 8);
                ctx.fillStyle = '#fff';
                ctx.fillRect(rx - 4, r.y - 4, 3, 3);
            }
        }
    }

    // Частицы пыли
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
        }
        ctx.fillStyle = `rgba(211, 84, 0, ${p.alpha})`;
        ctx.fillRect(p.x + camX, p.y, p.size, p.size);
    }
}
