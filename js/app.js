// Global game constants
const GAME_CONFIG = {
    CONFIG_TRAITS: [
        { key: 'professions',   label: 'Профессия' },
        { key: 'health',        label: 'Здоровье' },
        { key: 'baggage',       label: 'Багаж' },
        { key: 'hobbies',       label: 'Хобби' },
        { key: 'phobia',        label: 'Фобия' },
        { key: 'special_cards', label: 'СПЕЦ-КАРТА' }
    ],
    DEFAULT_TRAIT_COUNT: 6,
    BLUR_AMOUNT: 18,
    VIBRATE_DURATION: 10,
    VIBRATE_DISASTER: [40, 60, 40],
    DEFAULT_ID: '1',
    CONTENT_JSON_PATH: 'data/content.json'
};

(async function initBunkerApp() {
    // Destructure constants
    const { CONFIG_TRAITS, DEFAULT_TRAIT_COUNT, VIBRATE_DURATION, DEFAULT_ID, CONTENT_JSON_PATH } = GAME_CONFIG;
    const DEFAULT_INDICES = new Array(DEFAULT_TRAIT_COUNT).fill(0);

    // State
    let isGameReady = false;
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('data');
    
    let myId = DEFAULT_ID;
    let indices = [...DEFAULT_INDICES];

    // Decode URL data
    if (encodedData) {
        try {
            const decodedString = atob(encodedData);
            const parsed = JSON.parse(decodedString);
            myId = String(parsed.my ?? DEFAULT_ID);
            indices = parsed.p ?? [...DEFAULT_INDICES];
        } catch (error) {
            console.error("URL decode error:", error.message);
        }
    }

    // Load game database
    window.gameDB = null;
    try {
        const response = await fetch(CONTENT_JSON_PATH);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        window.gameDB = await response.json();
        isGameReady = true;
    } catch (error) {
        console.error("Critical error loading game data:", error.message);
        showErrorState();
        return;
    }

    // Render player ID
    const idDisplay = document.getElementById('player-id');
    if (idDisplay) {
        idDisplay.textContent = `ID-${myId.padStart(2, '0')}`;
    }

    // Render traits
    const list = document.getElementById('traits-list');
    if (list) {
        CONFIG_TRAITS.forEach((item, i) => {
            const valIndex = indices[i] ?? 0;
            const traitArray = window.gameDB?.[item.key];
            const traitValue = (Array.isArray(traitArray) && traitArray[valIndex]) 
                ? traitArray[valIndex] 
                : "---";

            const div = document.createElement('div');
            div.className = 'trait';
            div.addEventListener('click', handleTraitClick);
            
            // Build structure safely
            const statusBox = document.createElement('div');
            statusBox.className = 'status-box';
            statusBox.textContent = 'LOCKED';
            
            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = item.label;
            
            const value = document.createElement('div');
            value.className = 'value';
            value.textContent = traitValue;
            
            div.appendChild(statusBox);
            div.appendChild(label);
            div.appendChild(value);
            list.appendChild(div);
        });
    }

    // Trait click handler
    function handleTraitClick() {
        this.classList.toggle('open');
        const status = this.querySelector('.status-box');
        if (status) {
            status.textContent = this.classList.contains('open') ? 'OPEN' : 'LOCKED';
        }
        if (navigator.vibrate) {
            navigator.vibrate(VIBRATE_DURATION);
        }
    }

    // Error state
    function showErrorState() {
        const list = document.getElementById('traits-list');
        const btn = document.querySelector('.disaster-btn');
        if (list) {
            list.innerHTML = '<div style="color: red; padding: 20px;">Ошибка загрузки данных</div>';
        }
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        }
    }

    // Enable disaster button
    const disasterBtn = document.querySelector('.disaster-btn');
    if (disasterBtn) {
        disasterBtn.disabled = !isGameReady;
    }
})();

// Modal functions
window.openDisaster = function() {
    if (!window.gameDB?.disasters?.length) {
        console.warn('Disasters data not available');
        return;
    }
    const modal = document.getElementById('disaster-modal');
    const disasters = window.gameDB.disasters;
    const randomD = disasters[Math.floor(Math.random() * disasters.length)];
    
    const titleEl = document.getElementById('d-title');
    const descEl = document.getElementById('d-desc');
    
    if (titleEl) titleEl.textContent = randomD.title.toUpperCase();
    if (descEl) descEl.textContent = randomD.description;
    
    if (modal) modal.style.display = 'block';
    if (navigator.vibrate) navigator.vibrate(GAME_CONFIG.VIBRATE_DISASTER);
};

window.closeDisaster = function() {
    const modal = document.getElementById('disaster-modal');
    if (modal) modal.style.display = 'none';
};