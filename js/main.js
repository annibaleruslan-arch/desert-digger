const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = new Player();
let gameState = { money: 0, weight: 0, maxWeight: 2.0, inventory: [], hasDetector: false, hasLens: false };

let keys = {};
let moveDir = 0;
let currentTarget = null;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.y = canvas.height - 180;

    expandWorld(-1500, 1500, player.y);
}

function startGame() {
    document.getElementById('main-menu').classList.add('hidden');
    init();
    updateUI();
    requestAnimationFrame(loop);
}

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function startMove(dir) { moveDir = dir; }
function stopMove() { moveDir = 0; }

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

function update() {
    let dir = 0;
    if (keys['KeyA'] || keys['ArrowLeft'] || moveDir === -1) dir = -1;
    if (keys['KeyD'] || keys['ArrowRight'] || moveDir === 1) dir = 1;

    player.update(dir);
    expandWorld(player.x - 1500, player.x + 1500, player.y);

    let promptEl = document.getElementById('action-prompt');
    let distToShop = Math.abs(player.x - 0);

    if (distToShop < 55) {
        currentTarget = { type: 'shop' };
        document.getElementById('prompt-title').innerText = "ЛАВКА СКУПЩИКА";
        document.getElementById('prompt-desc').innerText = "Торговец ждет хабар";
        document.getElementById('prompt-btn').innerText = "ОТКРЫТЬ";
        document.getElementById('prompt-btn').style.display = "inline-block";
        promptEl.classList.remove('hidden');
    } else {
        let rock = worldRocks.find(r => Math.abs(player.x - r.x) < 30);
        if (rock) {
            currentTarget = { type: 'rock', data: rock };
            if (rock.isDeep && !gameState.hasDetector) {
                document.getElementById('prompt-title').innerText = "❓ ГЛУБОКИЙ СИГНАЛ";
                document.getElementById('prompt-desc').innerText = "Нужен металлоискатель!";
                document.getElementById('prompt-btn').style.display = "none";
            } else {
                document.getElementById('prompt-title').innerText = rock.name;
                let pText = gameState.hasLens ? `${rock.price} $` : "??? $";
                document.getElementById('prompt-desc').innerText = `Вес: ${rock.weight} кг | Цена: ${pText}`;
                document.getElementById('prompt-btn').innerText = "ПОДНЯТЬ";
                document.getElementById('prompt-btn').style.display = "inline-block";
            }
            promptEl.classList.remove('hidden');
        } else {
            currentTarget = null;
            promptEl.classList.add('hidden');
        }
    }
}

function handleAction() {
    if (!currentTarget) return;
    if (currentTarget.type === 'shop') {
        document.getElementById('shop-modal').classList.remove('hidden');
    } else if (currentTarget.type === 'rock') {
        let r = currentTarget.data;
        if (gameState.weight + r.weight > gameState.maxWeight) {
            alert("Рюкзак забит!");
            return;
        }
        
        // Создаем частицы при поднятии
        for(let i=0; i<8; i++) {
            particles.push({
                x: r.x,
                y: r.y,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3,
                size: 3,
                alpha: 1,
                color: r.color
            });
        }

        gameState.inventory.push(r);
        gameState.weight = parseFloat((gameState.weight + r.weight).toFixed(3));
        worldRocks = worldRocks.filter(item => item.id !== r.id);
        updateUI();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderWorld(ctx, player, gameState);
    player.render(ctx, canvas.width / 2 - player.x);
}
