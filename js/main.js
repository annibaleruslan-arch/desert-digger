const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = null;
let gameState = { 
    money: 0, 
    weight: 0, 
    maxWeight: 2.0, 
    inventory: [], 
    hasDetector: false, 
    hasLens: false
};

let keys = {};
let moveDir = 0;
let currentTarget = null;
let isGameRunning = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Если игрок уже создан — держим его на уровне земли
    if (player && typeof getGroundY === 'function') {
        player.y = getGroundY(canvas) - 30;
    }
}

window.addEventListener('resize', resizeCanvas);

function init() {
    resizeCanvas();
    if (typeof Player === 'function') {
        player = new Player();
        player.y = getGroundY(canvas) - 30;
    }
    if (typeof expandWorld === 'function') {
        expandWorld(-1500, 1500, canvas);
    }
}

function startGame() {
    document.getElementById('main-menu').classList.add('hidden');
    init();
    if (typeof updateUI === 'function') updateUI();
    if (!isGameRunning) {
        isGameRunning = true;
        requestAnimationFrame(loop);
    }
}

function openSettings() { document.getElementById('settings-modal').classList.remove('hidden'); }
function closeSettings() { document.getElementById('settings-modal').classList.add('hidden'); }

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function startMove(dir) { moveDir = dir; }
function stopMove() { moveDir = 0; }

function loop() {
    update();
    render();
    if (isGameRunning) {
        requestAnimationFrame(loop);
    }
}

function update() {
    if (!player) return;

    let dir = 0;
    if (keys['KeyA'] || keys['ArrowLeft'] || moveDir === -1) dir = -1;
    if (keys['KeyD'] || keys['ArrowRight'] || moveDir === 1) dir = 1;

    player.update(dir);
    player.y = getGroundY(canvas) - 30;

    if (typeof expandWorld === 'function') {
        expandWorld(player.x - 1500, player.x + 1500, canvas);
    }

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
            document.getElementById('prompt-title').innerText = rock.name;
            document.getElementById('prompt-desc').innerText = `Вес: ${rock.weight} кг`;
            document.getElementById('prompt-btn').innerText = "ПОДНЯТЬ";
            document.getElementById('prompt-btn').style.display = "inline-block";
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
        gameState.inventory.push(r);
        gameState.weight = parseFloat((gameState.weight + r.weight).toFixed(3));
        worldRocks = worldRocks.filter(item => item.id !== r.id);
        if (typeof updateUI === 'function') updateUI();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (typeof renderWorld === 'function' && player) {
        renderWorld(ctx, player, gameState, canvas);
        player.render(ctx, canvas.width / 2 - player.x);
    }
}
