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
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        localStorage.setItem('theme', initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
        updateThemeIcon(initialTheme);
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
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

// 修改初始化方式，确保DOM完全加载
function init() {
    showMilliseconds = localStorage.getItem('showMilliseconds') === 'true';

    updateTime();
    initTheme();

    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.addEventListener('click', toggleMilliseconds);
        timeElement.classList.toggle('show-ms', showMilliseconds);
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// 使用两种方式确保初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('ServiceWorker 注册成功');

            // 监听更新
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        // 显示更新提示
                        if (confirm('发现新版本，是否刷新页面？')) {
                            window.location.reload();
                        }
                    }
                });
            });
        })
        .catch(error => console.log('ServiceWorker 注册失败:', error));

    // 监听 service worker 发来的消息
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'UPDATE_AVAILABLE') {
            if (confirm('发现新版本，是否刷新页面？')) {
                window.location.reload();
            }
        }
    });
} 