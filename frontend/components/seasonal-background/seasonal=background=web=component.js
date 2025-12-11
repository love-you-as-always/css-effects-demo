// seasonal-background-web-component.js
class SeasonalBackgroundComponent extends HTMLElement {
    constructor() {
        super();
        
        // 获取配置属性
        this.config = {
            showTime: this.getAttribute('show-time') !== 'false',
            showGreeting: this.getAttribute('show-greeting') !== 'false',
            showFallingEffects: this.getAttribute('show-falling') !== 'false',
            autoUpdate: this.getAttribute('auto-update') !== 'false',
            updateInterval: parseInt(this.getAttribute('update-interval')) || 1000
        };
        
        // 季节数据（可以从原JS中复制过来）
        this.seasons = {
            spring: { name: '春季', months: [3, 4, 5], icon: 'fa-seedling', color: '#4CAF50', particle: '🌸' },
            summer: { name: '夏季', months: [6, 7, 8], icon: 'fa-sun', color: '#FF9800', particle: '☀️' },
            autumn: { name: '秋季', months: [9, 10, 11], icon: 'fa-leaf', color: '#FF5722', particle: '🍂' },
            winter: { name: '冬季', months: [12, 1, 2], icon: 'fa-snowflake', color: '#2196F3', particle: '❄️' }
        };
        
        this.currentSeason = null;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.init();
    }

    // 渲染HTML结构
    render() {
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* 包含所有CSS样式 - 从原CSS文件复制过来 */
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: -9999;
                    overflow: hidden;
                }
                
                .seasonal-bg-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                
                .seasonal-bg-image {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    opacity: 0;
                    transition: opacity 1s ease;
                }
                
                .seasonal-bg-image.active {
                    opacity: 1;
                }
                
                .seasonal-bg-overlay {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%);
                    backdrop-filter: blur(2px);
                }
                
                /* 时间显示样式 */
                .seasonal-time-display {
                    position: fixed;
                    top: 30px;
                    left: 30px;
                    color: white;
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    animation: fadeIn 1s ease;
                }
                
                /* 飘落效果样式 */
                .seasonal-falling-effects {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;
                    z-index: 9998;
                }
                
                .seasonal-particle {
                    position: absolute;
                    top: -50px;
                    animation: fall linear infinite;
                    pointer-events: none;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fall {
                    to { transform: translateY(100vh); }
                }
                
                /* 响应式设计 */
                @media (max-width: 768px) {
                    .seasonal-time-display {
                        position: relative;
                        top: auto;
                        left: auto;
                        margin: 20px auto;
                        width: 90%;
                        text-align: center;
                    }
                }
            </style>
            
            <div class="seasonal-bg-container">
                <div class="seasonal-bg-image" id="spring-bg" style="background-image: url('/frontend/assets/backgrounds/spring.jpg');"></div>
                <div class="seasonal-bg-image" id="summer-bg" style="background-image: url('/frontend/assets/backgrounds/summer.jpg');"></div>
                <div class="seasonal-bg-image" id="autumn-bg" style="background-image: url('/frontend/assets/backgrounds/autumn.jpg');"></div>
                <div class="seasonal-bg-image" id="winter-bg" style="background-image: url('/frontend/assets/backgrounds/winter.jpg');"></div>
                <div class="seasonal-bg-overlay"></div>
            </div>
            
            ${this.config.showTime ? `
                <div class="seasonal-time-display">
                    <div class="seasonal-date-container">
                        <div class="seasonal-icon-wrapper" id="season-icon">
                            <i class="fas fa-snowflake"></i>
                        </div>
                        <div class="seasonal-date-info">
                            <div class="seasonal-date" id="date-display">--年--月--日 星期-</div>
                            <div class="seasonal-time" id="time-display">--:--:--</div>
                        </div>
                    </div>
                    ${this.config.showGreeting ? `
                        <div class="seasonal-greeting" id="greeting-display">加载中...</div>
                    ` : ''}
                </div>
            ` : ''}
            
            ${this.config.showFallingEffects ? `
                <div class="seasonal-falling-effects" id="falling-container"></div>
            ` : ''}
        `;
        
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // 初始化组件
    init() {
        this.currentSeason = this.getCurrentSeason();
        this.applySeasonTheme();
        this.updateDateTime();
        
        if (this.config.showFallingEffects) {
            this.createFallingEffects();
        }
        
        if (this.config.autoUpdate) {
            this.startAutoUpdate();
        }
    }

    // 获取当前季节
    getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        for (const [key, season] of Object.entries(this.seasons)) {
            if (season.months.includes(month)) return key;
        }
        return 'winter';
    }

    // 应用季节主题
    applySeasonTheme() {
        const season = this.seasons[this.currentSeason];
        if (!season) return;

        // 切换背景
        this.shadowRoot.querySelectorAll('.seasonal-bg-image').forEach(bg => {
            bg.classList.remove('active');
        });
        
        const activeBg = this.shadowRoot.getElementById(`${this.currentSeason}-bg`);
        if (activeBg) activeBg.classList.add('active');

        // 更新图标
        const icon = this.shadowRoot.getElementById('season-icon');
        if (icon && this.config.showTime) {
            icon.innerHTML = `<i class="fas ${season.icon}"></i>`;
            icon.style.color = season.color;
        }
    }

    // 更新时间
    updateDateTime() {
        if (!this.config.showTime) return;
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[now.getDay()];
        
        const dateEl = this.shadowRoot.getElementById('date-display');
        const timeEl = this.shadowRoot.getElementById('time-display');
        
        if (dateEl) {
            dateEl.textContent = `${year}年${month}月${day}日 星期${weekday}`;
        }
        
        if (timeEl) {
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            timeEl.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    // 创建飘落效果
    createFallingEffects() {
        const container = this.shadowRoot.getElementById('falling-container');
        if (!container) return;
        
        container.innerHTML = '';
        const season = this.seasons[this.currentSeason];
        
        const count = { spring: 25, summer: 15, autumn: 35, winter: 50 }[this.currentSeason] || 30;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'seasonal-particle';
            particle.textContent = season.particle;
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                font-size: ${Math.random() * 20 + 12}px;
                animation-duration: ${Math.random() * 15 + 10}s;
                animation-delay: ${Math.random() * 8}s;
                color: ${season.color};
                opacity: ${Math.random() * 0.4 + 0.3};
            `;
            container.appendChild(particle);
        }
    }

    // 自动更新
    startAutoUpdate() {
        if (this.config.showTime) {
            this.timeInterval = setInterval(() => {
                this.updateDateTime();
            }, this.config.updateInterval);
        }
    }

    disconnectedCallback() {
        if (this.timeInterval) clearInterval(this.timeInterval);
    }

    // 公共方法
    setSeason(seasonKey) {
        if (this.seasons[seasonKey]) {
            this.currentSeason = seasonKey;
            this.applySeasonTheme();
            if (this.config.showFallingEffects) {
                this.createFallingEffects();
            }
            return true;
        }
        return false;
    }
}

// 注册自定义元素
customElements.define('seasonal-background', SeasonalBackgroundComponent);