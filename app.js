let showMilliseconds = false;

// 格式化时间的辅助函数
function formatTime(date, showMS) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
    return showMS 
        ? `${hours}:${minutes}:${seconds}.${milliseconds}`
        : `${hours}:${minutes}:${seconds}`;
}

// 更新时间显示逻辑
function updateTime() {
    const future = new Date(Date.now() + 15 * 60 * 1000);
    const timeString = formatTime(future, showMilliseconds);
    document.getElementById('time').textContent = timeString;
    requestAnimationFrame(updateTime);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const sunPath = document.querySelector('.sun');
    const moonPath = document.querySelector('.moon');
    
    if (theme === 'dark') {
        sunPath.style.display = 'none';
        moonPath.style.display = 'block';
    } else {
        sunPath.style.display = 'block';
        moonPath.style.display = 'none';
    }
}

function toggleMilliseconds() {
    showMilliseconds = !showMilliseconds;
    localStorage.setItem('showMilliseconds', showMilliseconds);
    
    const timeElement = document.getElementById('time');
    timeElement.classList.toggle('show-ms', showMilliseconds);
}

document.addEventListener('DOMContentLoaded', () => {
    showMilliseconds = localStorage.getItem('showMilliseconds') === 'true';
    
    updateTime();
    initTheme();
    
    const timeElement = document.getElementById('time');
    timeElement.addEventListener('click', toggleMilliseconds);
    timeElement.classList.toggle('show-ms', showMilliseconds);
    
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('ServiceWorker 注册成功'))
        .catch(error => console.log('ServiceWorker 注册失败:', error));
} 