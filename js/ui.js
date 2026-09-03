function openInventory() {
    let list = document.getElementById('inventory-list');
    list.innerHTML = '';
    if (gameState.inventory.length === 0) {
        list.innerHTML = '<div style="text-align:center; color:#7f8c8d; font-size:8px; padding:20px;">Рюкзак пуст</div>';
    } else {
        gameState.inventory.forEach(item => {
            let pText = gameState.hasLens ? `${item.price} $` : "??? $";
            list.innerHTML += `
                <div class="item-card">
                    <strong style="color:${item.color}">${item.name}</strong>
                    <span>${item.weight} кг</span>
                    <span style="color:#f1c40f">${pText}</span>
                </div>`;
        });
    }
    document.getElementById('inventory-modal').classList.remove('hidden');
}

function closeInventory() { document.getElementById('inventory-modal').classList.add('hidden'); }
function closeShop() { document.getElementById('shop-modal').classList.add('hidden'); }

function sellAllRocks() {
    let sum = 0;
    gameState.inventory.forEach(i => sum += i.price);
    gameState.money += sum;
    gameState.inventory = [];
    gameState.weight = 0;
    updateUI();
    closeInventory();
    closeShop();
}

function buyItem(type, price) {
    if (gameState.money < price) { alert("Мало бабла!"); return; }
    if (type === 'detector' && !gameState.hasDetector) {
        gameState.hasDetector = true;
        gameState.money -= price;
    } else if (type === 'lens' && !gameState.hasLens) {
        gameState.hasLens = true;
        gameState.money -= price;
    }
    updateUI();
}

function updateUI() {
    document.getElementById('money-display').innerText = gameState.money;
    document.getElementById('weight-display').innerText = gameState.weight.toFixed(3);
    document.getElementById('max-weight-display').innerText = gameState.maxWeight.toFixed(3);
}
