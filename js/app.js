document.addEventListener('DOMContentLoaded', () => {
    // Получаем параметры из URL
    const params = new URLSearchParams(window.location.search);
    
    // Функция для безопасного получения данных
    const getParam = (name) => params.get(name) || "Неизвестно";

    // Обновляем UI
    const ui = {
        job: document.getElementById('job'),
        health: document.getElementById('health'),
        item: document.getElementById('item'),
        disaster: document.getElementById('disaster-title')
    };

    if(ui.job) ui.job.innerText = getParam('job');
    if(ui.health) ui.health.innerText = getParam('health');
    if(ui.item) ui.item.innerText = getParam('item');
    if(ui.disaster) ui.disaster.innerText = getParam('d_name'); // d_name для катастрофы
});