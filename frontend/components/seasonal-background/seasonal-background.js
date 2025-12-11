/**
 * 季节背景组件
 * 功能：季节背景切换 + 时间日期显示 + 飘落效果 + 季节问候
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
            updateInterval: 1000, // 时间更新间隔(ms)
            ...options
        };
        
        // 季节数据
        this.seasons = {
            spring: {
                name: '春季',
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
                name: '夏季',
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
                name: '秋季',
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
                name: '冬季',
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
        
        // 创建飘落效果
        if (this.config.showFallingEffects) {
            this.createFallingEffects(this.currentSeason);
        }
        
        // 设置自动更新
        if (this.config.autoUpdate) {
            this.startAutoUpdate();
        }
        
        console.log('季节背景组件初始化完成 - 当前季节:', this.currentSeason);
    }
    
    // 检查必要元素是否存在
    checkElements() {
        const requiredSelectors = [
            '.seasonal-background-container',
            '.seasonal-time-display',
            '.seasonal-falling-effects',
            '#seasonal-icon',
            '#seasonal-date',
            '#seasonal-time',
            '#seasonal-greeting'
        ];
        
        requiredSelectors.forEach(selector => {
            if (!document.querySelector(selector)) {
                console.warn(`季节背景组件：未找到元素 ${selector}，请确保HTML结构正确`);
            }
        });
    }
    
    // 获取当前季节
    getCurrentSeason() {
        const now = new Date();
        const month = now.getMonth() + 1;
        
        for (const [seasonKey, seasonData] of Object.entries(this.seasons)) {
            if (seasonData.months.includes(month)) {
                return seasonKey;
            }
        }
        
        // 默认冬季
        return 'winter';
    }
    
    // 应用季节主题
    applySeasonTheme(seasonKey) {
        const season = this.seasons[seasonKey];
        if (!season) return;
        
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
        
        // 3. 更新body的class（用于主题样式）
        document.body.className = '';
        document.body.classList.add(`season-${seasonKey}`);
        
        // 4. 更新问候语
        if (this.config.showGreeting) {
            this.updateGreeting();
        }
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
                greetingElement.textContent = randomQuote;
            } else {
                // 70%几率显示时间问候
                greetingElement.textContent = season.greetings[timeOfDay];
            }
            greetingElement._lastUpdate = nowTime;
        }
    }
    
    // 创建飘落效果
    createFallingEffects(seasonKey) {
        const season = this.seasons[seasonKey];
        const container = document.querySelector('.seasonal-falling-effects');
        
        if (!container || !season) return;
        
        // 清空现有粒子
        container.innerHTML = '';
        
        // 根据季节设置粒子数量
        let particleCount;
        switch(seasonKey) {
            case 'spring': particleCount = 25; break;
            case 'summer': particleCount = 15; break;
            case 'autumn': particleCount = 35; break;
            case 'winter': particleCount = 50; break;
            default: particleCount = 30;
        }
        
        // 创建粒子
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `seasonal-particle ${season.particleClass}`;
            particle.textContent = season.particle;
            particle.dataset.index = i;
            
            // 随机属性
            const left = Math.random() * 100;
            const size = Math.random() * 20 + 12;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 8;
            const opacity = Math.random() * 0.4 + 0.3;
            const sway = Math.random() * 100 + 50;
            
            particle.style.cssText = `
                left: ${left}%;
                font-size: ${size}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${opacity};
                --sway-distance: ${sway}px;
            `;
            
            container.appendChild(particle);
        }
    }
    
    // 开始自动更新
    startAutoUpdate() {
        // 更新时间
        if (this.config.showTime) {
            this.timeInterval = setInterval(() => {
                this.updateDateTime();
            }, this.config.updateInterval);
        }
        
        // 每30分钟重新创建飘落效果（避免内存泄漏）
        this.fallingInterval = setInterval(() => {
            if (this.config.showFallingEffects) {
                this.createFallingEffects(this.currentSeason);
            }
        }, 30 * 60 * 1000);
        
        // 每6小时检查季节变化
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
    
    // 手动切换季节（可用于测试）
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
        
        // 移除所有粒子
        const container = document.querySelector('.seasonal-falling-effects');
        if (container) {
            container.innerHTML = '';
        }
        
        console.log('季节背景组件已销毁');
    }
}

// 自动初始化（如果页面已加载）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.seasonalBackground = new SeasonalBackground();
    });
} else {
    window.seasonalBackground = new SeasonalBackground();
}

// 全局导出
window.SeasonalBackground = SeasonalBackground;