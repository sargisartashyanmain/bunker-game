(async function initBunkerApp() {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('data');
    
    let myId = '1';
    let indices = [0, 0, 0, 0, 0];

    // ДЕКОДИРОВАНИЕ BASE64
    if (encodedData) {
        try {
            // b64 -> string -> JSON
            const decodedString = atob(encodedData);
            const parsed = JSON.parse(decodedString);
            
            myId = String(parsed.my || '1');
            indices = parsed.p || [0, 0, 0, 0, 0];
        } catch (e) {
            console.error("Ошибка декодирования данных. Проверьте URL.");
        }
    }

    window.gameDB = null;

    try {
        const response = await fetch('data/content.json');
        window.gameDB = await response.json();
    } catch (e) {
        console.error("Критическая ошибка: JSON не загружен");
        return;
    }

    const config = [
        { key: 'professions', label: 'Профессия' },
        { key: 'health',      label: 'Здоровье' },
        { key: 'baggage',     label: 'Багаж' },
        { key: 'hobbies',     label: 'Хобби' },
        { key: 'phobia',      label: 'Фобия' }
    ];

    const list = document.getElementById('traits-list');
    const idDisplay = document.getElementById('player-id');
    if (idDisplay) idDisplay.innerText = `ID-${myId.padStart(2, '0')}`;

    if (list) {
        config.forEach((item, i) => {
            const valIndex = indices[i] || 0;
            const text = (window.gameDB[item.key] && window.gameDB[item.key][valIndex]) 
                         ? window.gameDB[item.key][valIndex] 
                         : "---";

            const div = document.createElement('div');
            div.className = 'trait';
            div.onclick = function() { 
                this.classList.toggle('open'); 
                const status = this.querySelector('.status-box');
                if (status) status.innerText = this.classList.contains('open') ? 'OPEN' : 'LOCKED';
                if(navigator.vibrate) navigator.vibrate(10); 
            };
            
            div.innerHTML = `
                <div class="status-box">LOCKED</div>
                <div class="label">${item.label}</div>
                <div class="value">${text}</div>
            `;
            list.appendChild(div);
        });
    }
})();

// Функции модалки (без изменений)
function openDisaster() {
    if (!window.gameDB) return;
    const modal = document.getElementById('disaster-modal');
    const randomD = window.gameDB.disasters[Math.floor(Math.random() * window.gameDB.disasters.length)];
    document.getElementById('d-title').innerText = randomD.title.toUpperCase();
    document.getElementById('d-desc').innerText = randomD.description;
    modal.style.display = "block";
    if(navigator.vibrate) navigator.vibrate([40, 60, 40]);
}

function closeDisaster() {
    document.getElementById('disaster-modal').style.display = "none";
}

const obj = { my: 1, p: [10, 4, 2, 1, 3] };
const base64 = btoa(JSON.stringify(obj));
console.log("Твоя ссылка: index.html?data=" + base64);