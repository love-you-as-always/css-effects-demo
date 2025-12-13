/**
 * 季节背景组件
 * 功能：季节背景切换 + 时间日期显示 + 飘落效果 + 季节问候 + 头部主题
 * 使用方法：
 * 1. 引入seasonal-background.css
 * 2. 引入seasonal-background.js
 * 3. 在页面body中添加seasonal-background.html的内容
 * 4. 调用 new SeasonalBackground()
 */

class SeasonalBackground {
    constructor(options = {}) {
        // 默认配置
        this.config = {
            showTime: true,
            showGreeting: true,
            showFallingEffects: true,
            autoUpdate: true,
            updateInterval: 1000,
            ...options
        };
        
        // 季节数据 - 使用英文名称
        this.seasons = {
            spring: {
                name: 'spring',
                chineseName: '春季',
                months: [3, 4, 5],
                icon: 'fa-seedling',
                color: '#4CAF50',
                bgId: 'season-bg-spring',
                particle: '🌸',
                particleClass: 'seasonal-particle-spring',
                quotes: [
                    '春江水暖，万物复苏',
                    '春风十里，不如有你',
                    '春暖花开，未来可期',
                    '一年之计在于春'
                ],
                greetings: {
                    morning: '春日清晨，活力满满',
                    afternoon: '春日午后，温暖惬意',
                    evening: '春日晚风，温柔拂面',
                    night: '春夜静谧，好梦相伴'
                }
            },
            summer: {
                name: 'summer',
                chineseName: '夏季',
                months: [6, 7, 8],
                icon: 'fa-sun',
                color: '#FF9800',
                bgId: 'season-bg-summer',
                particle: '☀️',
                particleClass: 'seasonal-particle-summer',
                quotes: [
                    '夏树苍翠，生机勃勃',
                    '夏日炎炎，有你真甜',
                    '生如夏花之绚烂',
                    '接天莲叶无穷碧'
                ],
                greetings: {
                    morning: '夏日晨光，热情洋溢',
                    afternoon: '炎炎午后，注意防暑',
                    evening: '夏日傍晚，凉风习习',
                    night: '夏夜星空，璀璨夺目'
                }
            },
            autumn: {
                name: 'autumn',
                chineseName: '秋季',
                months: [9, 10, 11],
                icon: 'fa-leaf',
                color: '#FF5722',
                bgId: 'season-bg-autumn',
                particle: '🍂',
                particleClass: 'seasonal-particle-autumn',
                quotes: [
                    '秋高气爽，硕果累累',
                    '一叶知秋，岁月静好',
                    '秋风起兮白云飞',
                    '天凉好个秋'
                ],
                greetings: {
                    morning: '秋日清晨，清爽宜人',
                    afternoon: '秋高气爽，正是好时光',
                    evening: '秋日黄昏，夕阳无限',
                    night: '秋夜微凉，注意保暖'
                }
            },
            winter: {
                name: 'winter',
                chineseName: '冬季',
                months: [12, 1, 2],
                icon: 'fa-snowflake',
                color: '#2196F3',
                bgId: 'season-bg-winter',
                particle: '❄️',
                particleClass: 'seasonal-particle-winter',
                quotes: [
                    '冬至已至，静待春归',
                    '瑞雪兆丰年',
                    '晚来天欲雪，能饮一杯无',
                    '岁寒，然后知松柏之后凋也'
                ],
                greetings: {
                    morning: '冬日早晨，温暖如春',
                    afternoon: '冬日午后，阳光正好',
                    evening: '冬日晚霞，宁静美好',
                    night: '寒夜漫漫，注意保暖'
                }
            }
        };
        
        // 当前季节
        this.currentSeason = null;
        
        // 初始化
        this.init();
    }
    
    // 初始化组件
    init() {
        // 检测必要元素
        this.checkElements();
        
        // 设置当前季节
        this.currentSeason = this.getCurrentSeason();
        
        // 应用季节主题
        this.applySeasonTheme(this.currentSeason);
        
        // 初始化时间显示
        if (this.config.showTime) {
            this.updateDateTime();
        }
        
        // 初始化导航栏高亮
        this.initNavHighlight();
        this.updateBrandInfoByPage();
        
        // 创建飘落效果
        if (this.config.showFallingEffects) {
            this.createFallingEffects(this.currentSeason);
        }
        
        // 设置自动更新
        if (this.config.autoUpdate) {
            this.startAutoUpdate();
        }
        
        console.log('✅ 季节背景组件初始化完成 - 当前季节:', this.currentSeason);
    }
    
    // 检查必要元素是否存在
    checkElements() {
        const requiredSelectors = [
            '.seasonal-background-container',
            '#seasonal-date',
            '#seasonal-time',
            '#seasonal-greeting',
            '.seasonal-falling-effects',
            '#seasonal-icon',
            '.professional-header'
        ];
        
        requiredSelectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (!element) {
                console.warn(`⚠️ 季节背景组件：未找到元素 ${selector}`);
            } else {
                console.log(`✓ 找到元素: ${selector}`);
            }
        });
    }
    
    // 获取当前季节
    getCurrentSeason() {
        const month = new Date().getMonth() + 1; // 1-12月
        console.log(`📅 当前月份: ${month}月`);
        
        // 简单季节判断
        if (month >= 3 && month <= 5) {
            return 'spring';
        } else if (month >= 6 && month <= 8) {
            return 'summer';
        } else if (month >= 9 && month <= 11) {
            return 'autumn';
        } else {
            return 'winter'; // 12月, 1月, 2月
        }
    }
    
    // 应用季节主题
    applySeasonTheme(seasonKey) {
        const season = this.seasons[seasonKey];
        if (!season) return;
        
        console.log(`🎨 应用季节主题: ${season.chineseName}`);
        console.log(`🎨 季节颜色: ${season.color}`);
        
        // 1. 切换背景图片
        document.querySelectorAll('.seasonal-bg-image').forEach(bg => {
            bg.classList.remove('active');
        });
        
        const activeBg = document.getElementById(season.bgId);
        if (activeBg) {
            activeBg.classList.add('active');
        }
        
        // 2. 更新季节图标
        const iconElement = document.getElementById('seasonal-icon');
        if (iconElement) {
            iconElement.innerHTML = `<i class="fas ${season.icon}"></i>`;
            iconElement.style.color = season.color;
        }
        
        // 3. 更新body的class
        document.body.className = '';
        document.body.classList.add(`season-${seasonKey}`);
        
        // 4. 更新头部样式
        this.updateHeaderTheme(season);
        
        // 5. 更新问候语
        if (this.config.showGreeting) {
            this.updateGreeting();
        }
    }
    
    // 更新头部主题
    updateHeaderTheme(season) {
        const header = document.querySelector('.professional-header');
        if (!header) {
            console.warn('⚠️ 未找到头部元素');
            return;
        }
        
        // 移除所有季节类
        const seasonClasses = ['header-spring', 'header-summer', 'header-autumn', 'header-winter'];
        seasonClasses.forEach(cls => header.classList.remove(cls));
        
        // 添加当前季节类
        const seasonClass = `header-${season.name}`;
        header.classList.add(seasonClass);
        
        console.log(`✅ 头部应用季节类: ${seasonClass}`);
        
        // 设置一些内联样式确保效果
        this.applyInlineHeaderStyles(season);
    }
    
    // 应用内联头部样式
    applyInlineHeaderStyles(season) {
        const header = document.querySelector('.professional-header');
        const nav = document.querySelector('.main-navigation');
        const timeCurrent = document.querySelector('.time-current');
        
        // 头部主色调
        if (header) {
            header.style.setProperty('--season-color', season.color);
        }
        
        // 导航栏样式
        if (nav) {
            const rgbaColor = this.hexToRgba(season.color, 0.2);
            nav.style.background = rgbaColor;
            nav.style.borderColor = this.hexToRgba(season.color, 0.4);
        }
        
        // 时间颜色
        if (timeCurrent) {
            timeCurrent.style.color = season.color;
            timeCurrent.style.textShadow = `0 0 10px ${this.hexToRgba(season.color, 0.4)}`;
        }
    }
    
    // 十六进制颜色转RGBA
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // 更新日期时间
    updateDateTime() {
        const now = new Date();
        
        // 获取日期信息
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[now.getDay()];
        
        // 获取时间信息
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        // 更新日期显示
        const dateElement = document.getElementById('seasonal-date');
        if (dateElement) {
            dateElement.textContent = `${year}年${month}月${day}日 星期${weekday}`;
        }
        
        // 更新时间显示
        const timeElement = document.getElementById('seasonal-time');
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // 更新问候语（每小时更新一次）
        if (this.config.showGreeting) {
            const currentHour = now.getHours();
            if (!this.lastGreetingUpdate || currentHour !== this.lastGreetingUpdate) {
                this.updateGreeting();
                this.lastGreetingUpdate = currentHour;
            }
        }
    }
    
    // 更新问候语
    updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        const season = this.seasons[this.currentSeason];
        const greetingElement = document.getElementById('seasonal-greeting');
        
        if (!greetingElement || !season) return;
        
        let timeOfDay;
        if (hour >= 5 && hour < 9) timeOfDay = 'morning';
        else if (hour >= 9 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 14) timeOfDay = 'afternoon';
        else if (hour >= 14 && hour < 18) timeOfDay = 'afternoon';
        else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
        else timeOfDay = 'night';
        
        // 每2小时随机切换一次
        const nowTime = Date.now();
        if (!greetingElement._lastUpdate || (nowTime - greetingElement._lastUpdate) > 2 * 60 * 60 * 1000) {
            if (Math.random() < 0.3) {
                // 30%几率显示季节语录
                const randomQuote = season.quotes[Math.floor(Math.random() * season.quotes.length)];
                greetingElement.textContent = `"${randomQuote}"`;
            } else {
                // 70%几率显示时间问候
                greetingElement.textContent = `"${season.greetings[timeOfDay]}"`;
            }
            greetingElement._lastUpdate = nowTime;
        }
    }
    // 初始化导航栏高亮
    initNavHighlight() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        let activeFound = false;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (this.isCurrentPage(href, currentPath, currentHash)) {
                link.classList.add('active');
                activeFound = true;
            }
        });
        
        if (!activeFound && navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
        
        this.bindNavClickEvents();
    }
    
    // 根据页面更新品牌信息
    updateBrandInfoByPage() {
        const path = window.location.pathname;
        const siteSubtitle = document.querySelector('.site-subtitle');
        
        if (!siteSubtitle) return;
        
        let subtitle = 'Premium Effects Gallery';
        if (path.includes('effects')) {
            subtitle = '效果库';
        } else if (path.includes('login')) {
            subtitle = '用户登录';
        } else if (path.includes('register')) {
            subtitle = '用户注册';
        } else if (path.includes('profile')) {
            subtitle = '个人中心';
        }
        
        siteSubtitle.textContent = subtitle;
    }
    
    // 判断是否当前页面
    isCurrentPage(href, currentPath, currentHash) {
        if (!href || href === '#' || href === '/') {
            return currentPath === '/' || currentPath === '/index.html' || currentPath === '';
        }
        
        if (href.startsWith('#')) {
            return currentHash === href || (currentHash === '' && href === '#home');
        }
        
        if (href.includes('.html')) {
            const hrefFilename = href.split('/').pop();
            const currentFilename = currentPath.split('/').pop();
            return hrefFilename === currentFilename;
        }
        
        return currentPath.includes(href);
    }
    
    // 绑定导航点击事件
    bindNavClickEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        window.history.pushState(null, null, href);
                    }
                }
                
                if (href && (href.includes('.html') || href.includes('/'))) {
                    localStorage.setItem('lastActiveNav', href);
                }
            });
        });
        
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                this.initNavHighlight();
            }, 100);
        });
    }
    
   createFallingEffects(seasonKey) {
    // 确保动画定义存在
    this._ensureAnimations();
    
    const season = this.seasons[seasonKey];
    if (!season) return;
    
    const container = document.querySelector('.seasonal-falling-effects');
    if (!container) return;
    
    // 确保容器样式
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9998;
        overflow: hidden;
    `;
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建粒子
    const particleCount = this._getParticleCount(seasonKey);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `seasonal-particle ${season.particleClass}`;
        particle.textContent = season.particle;
        
        // 应用内联样式确保生效
        this._applyParticleStyle(particle, i, seasonKey);
        
        container.appendChild(particle);
    }
    
    console.log(`✅ 创建 ${season.chineseName} 飘落效果: ${particleCount}个粒子`);
}

// 辅助方法：确保动画
_ensureAnimations() {
    if (!document.getElementById('seasonal-animations-backup')) {
        const style = document.createElement('style');
        style.id = 'seasonal-animations-backup';
        style.textContent = `@keyframes seasonal-fall {
            0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
            10% { opacity: 0.9; }
            90% { opacity: 0.4; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }`;
        document.head.appendChild(style);
    }
}

// 辅助方法：获取粒子数量
_getParticleCount(seasonKey) {
    switch(seasonKey) {
        case 'spring': return 25;
        case 'summer': return 15;
        case 'autumn': return 35;
        case 'winter': return 50;
        default: return 30;
    }
}

// 辅助方法：应用粒子样式
_applyParticleStyle(particle, index, seasonKey) {
    const left = Math.random() * 100;
    const size = 20 + Math.random() * 15;
    const duration = 10 + Math.random() * 15;
    const delay = Math.random() * 5;
    const opacity = 0.4 + Math.random() * 0.3;
    
    particle.style.cssText = `
        position: absolute;
        top: -50px;
        left: ${left}%;
        font-size: ${size}px;
        animation: seasonal-fall ${duration}s linear ${delay}s infinite;
        opacity: ${opacity};
        z-index: 1;
        pointer-events: none;
        user-select: none;
    `;
}
        
    // 开始自动更新
    startAutoUpdate() {
        if (this.config.showTime) {
            this.timeInterval = setInterval(() => {
                this.updateDateTime();
            }, this.config.updateInterval);
        }
        
        this.fallingInterval = setInterval(() => {
            if (this.config.showFallingEffects) {
                this.createFallingEffects(this.currentSeason);
            }
        }, 30 * 60 * 1000);
        
        this.seasonCheckInterval = setInterval(() => {
            const newSeason = this.getCurrentSeason();
            if (newSeason !== this.currentSeason) {
                this.currentSeason = newSeason;
                this.applySeasonTheme(newSeason);
                if (this.config.showFallingEffects) {
                    this.createFallingEffects(newSeason);
                }
            }
        }, 6 * 60 * 60 * 1000);
    }
    
    // 停止自动更新
    stopAutoUpdate() {
        if (this.timeInterval) clearInterval(this.timeInterval);
        if (this.fallingInterval) clearInterval(this.fallingInterval);
        if (this.seasonCheckInterval) clearInterval(this.seasonCheckInterval);
    }
    
    // 手动切换季节
    setSeason(seasonKey) {
        if (this.seasons[seasonKey]) {
            this.currentSeason = seasonKey;
            this.applySeasonTheme(seasonKey);
            if (this.config.showFallingEffects) {
                this.createFallingEffects(seasonKey);
            }
            return true;
        }
        return false;
    }
    
    // 获取当前季节信息
    getSeasonInfo() {
        return this.seasons[this.currentSeason];
    }
    
    // 销毁组件
    destroy() {
        this.stopAutoUpdate();
        
        const container = document.querySelector('.seasonal-falling-effects');
        if (container) {
            container.innerHTML = '';
        }
        
        console.log('季节背景组件已销毁');
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.seasonalBackground = new SeasonalBackground();
    });
} else {
    window.seasonalBackground = new SeasonalBackground();
}

// 全局导出
window.SeasonalBackground = SeasonalBackground;