let worldRocks = [];
let particles = [];

// Функция динамического расчета уровня земли
function getGroundY(canvas) {
    return canvas.height - 80; // Земля всегда на 80px выше нижнего края
}

function expandWorld(minX, maxX, canvas) {
    let groundY = getGroundY(canvas);
    for (let x = Math.floor(minX / 100) * 100; x <= maxX; x += 100) {
        if (x === 0) continue;
        if (!worldRocks.some(r => Math.abs(r.x - x) < 50)) {
            if (Math.random() < 0.4) {
                let template = getRandomRockTemplate();
                worldRocks.push({
                    id: Math.random().toString(36).substr(2, 9),
                    x: x + (Math.random() * 40 - 20),
                    y: groundY - 10, // Строго на поверхности
                    ...template
                });
            }
        }
    }
}

function renderWorld(ctx, player, gameState, canvas) {
    let offsetX = canvas.width / 2 - player.x;
    let groundY = getGroundY(canvas);

    // Небо
    let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#1d3557');
    skyGradient.addColorStop(0.6, '#457b9d');
    skyGradient.addColorStop(1, '#e63946');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Горы на фоне
    ctx.fillStyle = '#2b1b17';
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width * 0.25 + offsetX * 0.1, groundY - 120);
    ctx.lineTo(canvas.width * 0.55 + offsetX * 0.1, groundY);
    ctx.lineTo(canvas.width * 0.85 + offsetX * 0.1, groundY - 160);
    ctx.lineTo(canvas.width + 200 + offsetX * 0.1, groundY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();

    // Земля
    ctx.fillStyle = '#3a2212';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    // Поверхность земли (дерн/песок)
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(0, groundY, canvas.width, 6);

    // Лавка скупщика (на спавне X = 0)
    let shopX = 0 + offsetX;
    if (shopX + 100 > 0 && shopX < canvas.width) {
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(shopX - 40, groundY - 50, 80, 50);
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(shopX - 45, groundY - 62, 90, 12);
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('SHOP', shopX - 18, groundY - 50);
    }

    // Камни
    worldRocks.forEach(rock => {
        let rx = rock.x + offsetX;
        if (rx + 20 > 0 && rx < canvas.width) {
            ctx.fillStyle = rock.color || '#aaa';
            ctx.fillRect(rx - 8, groundY - 12, 16, 12);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeRect(rx - 8, groundY - 12, 16, 12);
        }
    });

    // Частицы
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x + offsetX, p.y, p.size, p.size);
        ctx.globalAlpha = 1;
    }
}
