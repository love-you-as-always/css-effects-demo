/**
 * 组件管理器 - 动态加载/卸载组件
 * 就像电视遥控器：按一下打开，再按一下关闭
 */

class ComponentManager {
    constructor() {
        // 已加载的组件实例
        this.loadedComponents = new Map();
        
        // 组件配置
        this.componentsConfig = {
            'seasonal-background': {
                name: '季节背景',
                enabled: false,
                files: {
                    html: '/frontend/components/seasonal-background/seasonal-background.html',
                    css: '/frontend/components/seasonal-background/seasonal-background.css',
                    js: '/frontend/components/seasonal-background/seasonal-background.js'
                },
                container: 'body',
                position: 'prepend' // 插入位置：prepend(开头) / append(结尾)
            },
            'header': {
                name: '头部导航',
                enabled: false,
                files: {
                    html: '/frontend/components/header/header.html',
                    css: '/frontend/components/header/header.css',
                    js: '/frontend/components/header/header.js'
                },
                container: 'body',
                position: 'afterbegin' // 在容器开头插入
            },
            'footer': {
                name: '网站脚部',
                enabled: false,
                files: {
                    html: '/frontend/components/footer/footer.html',
                    css: '/frontend/components/footer/footer.css',
                    js: '/frontend/components/footer/footer.js'
                },
                container: 'body',
                position: 'beforeend' // 在容器结尾插入
            }
        };
        
        // 初始化
        this.init();
    }
    
    init() {
        console.log('🔧 组件管理器初始化');
        
        // 从本地存储恢复状态
        this.loadStateFromStorage();
        
        // 创建控制面板
        this.createControlPanel();
        
        // 根据初始状态加载组件
        this.loadComponentsByState();
    }
    
    // 创建控制面板（可视化开关）
    createControlPanel() {
        // 如果已有控制面板，先移除
        const existingPanel = document.getElementById('component-control-panel');
        if (existingPanel) existingPanel.remove();
        
        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'component-control-panel';
        panel.className = 'component-control-panel';
        
        // 面板标题
        panel.innerHTML = `
            <div class="panel-header">
                <h3>🏗️ 组件控制中心</h3>
                <button class="panel-close" id="panelClose">×</button>
            </div>
            <div class="panel-body" id="panelSwitches">
                <!-- 开关会动态生成 -->
            </div>
            <div class="panel-footer">
                <button class="btn-toggle-all" id="toggleAll">一键开启/关闭</button>
                <button class="btn-save" id="saveState">保存设置</button>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(panel);
        
        // 添加样式
        this.addPanelStyles();
        
        // 生成开关
        this.generateSwitches();
        
        // 绑定事件
        this.bindPanelEvents();
        
        // 添加拖拽功能
        this.makePanelDraggable(panel);
    }
    
    // 添加控制面板样式
    addPanelStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 控制面板样式 */
            .component-control-panel {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 300px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 99999;
                font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
                overflow: hidden;
                border: 2px solid #667eea;
                transition: transform 0.3s ease;
                cursor: move;
            }
            
            .component-control-panel:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
            }
            
            .panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            }
            
            .panel-header h3 {
                margin: 0;
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .panel-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .panel-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }
            
            .panel-body {
                padding: 20px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .component-switch {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #eee;
            }
            
            .component-switch:last-child {
                border-bottom: none;
            }
            
            .component-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .component-icon {
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
            }
            
            .component-name {
                font-weight: 500;
                color: #333;
            }
            
            .component-status {
                font-size: 0.8rem;
                color: #666;
                margin-top: 2px;
            }
            
            /* 开关样式 */
            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 30px;
            }
            
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
            }
            
            .slider:before {
                position: absolute;
                content: "";
                height: 22px;
                width: 22px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            input:checked + .slider {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            input:checked + .slider:before {
                transform: translateX(30px);
            }
            
            .panel-footer {
                padding: 15px 20px;
                background: #f8f9fa;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }
            
            .panel-footer button {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .btn-toggle-all {
                background: #6c757d;
                color: white;
            }
            
            .btn-toggle-all:hover {
                background: #5a6268;
                transform: translateY(-2px);
            }
            
            .btn-save {
                background: #28a745;
                color: white;
            }
            
            .btn-save:hover {
                background: #218838;
                transform: translateY(-2px);
            }
            
            /* 状态指示器 */
            .status-indicator {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .status-online {
                background: #28a745;
                box-shadow: 0 0 10px #28a745;
            }
            
            .status-offline {
                background: #dc3545;
                box-shadow: 0 0 10px #dc3545;
            }
            
            .status-loading {
                background: #ffc107;
                animation: pulse 1.5s infinite;
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            
            /* 浮动按钮（打开控制面板） */
            .floating-control-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
                z-index: 99998;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .floating-control-btn:hover {
                transform: scale(1.1) rotate(90deg);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
            }
        `;
        document.head.appendChild(style);
    }
    
    // 生成开关控件
    generateSwitches() {
        const switchesContainer = document.getElementById('panelSwitches');
        if (!switchesContainer) return;
        
        let switchesHTML = '';
        
        for (const [componentId, config] of Object.entries(this.componentsConfig)) {
            const isEnabled = config.enabled;
            const statusClass = isEnabled ? 'status-online' : 'status-offline';
            const statusText = isEnabled ? '已加载' : '未加载';
            
            switchesHTML += `
                <div class="component-switch" data-component="${componentId}">
                    <div class="component-info">
                        <div class="component-icon">
                            <i class="fas fa-${this.getComponentIcon(componentId)}"></i>
                        </div>
                        <div>
                            <div class="component-name">${config.name}</div>
                            <div class="component-status">
                                <span class="status-indicator ${statusClass}"></span>
                                ${statusText}
                            </div>
                        </div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${isEnabled ? 'checked' : ''} 
                               onchange="window.componentManager.toggleComponent('${componentId}')">
                        <span class="slider"></span>
                    </label>
                </div>
            `;
        }
        
        switchesContainer.innerHTML = switchesHTML;
    }
    
    // 获取组件图标
    getComponentIcon(componentId) {
        const icons = {
            'seasonal-background': 'image',
            'header': 'bars',
            'footer': 'window-minimize'
        };
        return icons[componentId] || 'cube';
    }
    
    // 绑定面板事件
    bindPanelEvents() {
        // 关闭按钮
        const closeBtn = document.getElementById('panelClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hidePanel();
            });
        }
        
        // 一键切换
        const toggleAllBtn = document.getElementById('toggleAll');
        if (toggleAllBtn) {
            toggleAllBtn.addEventListener('click', () => {
                this.toggleAllComponents();
            });
        }
        
        // 保存设置
        const saveBtn = document.getElementById('saveState');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveStateToStorage();
                alert('✅ 设置已保存到本地存储');
            });
        }
    }
    
    // 使面板可拖拽
    makePanelDraggable(panel) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        const header = panel.querySelector('.panel-header');
        
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            panel.style.cursor = 'grabbing';
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            panel.style.left = (startLeft + deltaX) + 'px';
            panel.style.top = (startTop + deltaY) + 'px';
            panel.style.right = 'auto';
        }
        
        function stopDrag() {
            isDragging = false;
            panel.style.cursor = 'move';
        }
    }
    
    // 隐藏控制面板
    hidePanel() {
        const panel = document.getElementById('component-control-panel');
        if (panel) {
            panel.style.display = 'none';
            this.showFloatingButton();
        }
    }
    
    // 显示浮动按钮
    showFloatingButton() {
        // 如果已有浮动按钮，先移除
        const existingBtn = document.getElementById('floatingControlBtn');
        if (existingBtn) existingBtn.remove();
        
        const btn = document.createElement('button');
        btn.id = 'floatingControlBtn';
        btn.className = 'floating-control-btn';
        btn.innerHTML = '⚙️';
        btn.title = '打开组件控制面板';
        
        btn.addEventListener('click', () => {
            this.showPanel();
            btn.remove();
        });
        
        document.body.appendChild(btn);
    }
    
    // 显示控制面板
    showPanel() {
        const panel = document.getElementById('component-control-panel');
        if (panel) {
            panel.style.display = 'block';
        }
    }
    
    // ==================== 核心功能 ====================
    
    // 切换单个组件状态
    async toggleComponent(componentId) {
        const config = this.componentsConfig[componentId];
        if (!config) return false;
        
        try {
            // 更新状态
            config.enabled = !config.enabled;
            
            // 更新UI
            this.updateSwitchUI(componentId);
            
            if (config.enabled) {
                // 加载组件
                await this.loadComponent(componentId);
                console.log(`✅ 组件 "${config.name}" 已加载`);
            } else {
                // 卸载组件
                this.unloadComponent(componentId);
                console.log(`❌ 组件 "${config.name}" 已卸载`);
            }
            
            return true;
        } catch (error) {
            console.error(`切换组件 ${componentId} 失败:`, error);
            // 恢复状态
            config.enabled = !config.enabled;
            this.updateSwitchUI(componentId);
            return false;
        }
    }
    
    // 一键切换所有组件
    async toggleAllComponents() {
        const allEnabled = Object.values(this.componentsConfig).every(c => c.enabled);
        const targetState = !allEnabled;
        
        const operations = [];
        
        for (const [componentId, config] of Object.entries(this.componentsConfig)) {
            if (config.enabled !== targetState) {
                config.enabled = targetState;
                this.updateSwitchUI(componentId);
                
                if (targetState) {
                    operations.push(this.loadComponent(componentId));
                } else {
                    operations.push(Promise.resolve(this.unloadComponent(componentId)));
                }
            }
        }
        
        await Promise.all(operations);
        console.log(`🔄 所有组件已${targetState ? '开启' : '关闭'}`);
    }
    
    // 更新开关UI
    updateSwitchUI(componentId) {
        const switchElement = document.querySelector(`[data-component="${componentId}"]`);
        if (!switchElement) return;
        
        const config = this.componentsConfig[componentId];
        const checkbox = switchElement.querySelector('input[type="checkbox"]');
        const statusIndicator = switchElement.querySelector('.status-indicator');
        const statusText = switchElement.querySelector('.component-status');
        
        if (checkbox) checkbox.checked = config.enabled;
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator ' + 
                (config.enabled ? 'status-online' : 'status-offline');
        }
        if (statusText) {
            statusText.innerHTML = `
                <span class="status-indicator ${config.enabled ? 'status-online' : 'status-offline'}"></span>
                ${config.enabled ? '已加载' : '未加载'}
            `;
        }
    }
    
    // 加载组件
    async loadComponent(componentId) {
        const config = this.componentsConfig[componentId];
        if (!config || this.loadedComponents.has(componentId)) return;
        
        try {
            // 标记为加载中
            this.setComponentStatus(componentId, 'loading');
            
            // 1. 加载HTML
            const htmlResponse = await fetch(config.files.html);
            const html = await htmlResponse.text();
            
            // 2. 创建容器
            const container = document.querySelector(config.container) || document.body;
            const wrapper = document.createElement('div');
            wrapper.id = `component-${componentId}`;
            wrapper.className = `component-wrapper component-${componentId}`;
            wrapper.innerHTML = html;
            
            // 3. 插入到指定位置
            switch (config.position) {
                case 'prepend':
                    container.insertBefore(wrapper, container.firstChild);
                    break;
                case 'append':
                    container.appendChild(wrapper);
                    break;
                case 'afterbegin':
                    container.insertAdjacentElement('afterbegin', wrapper);
                    break;
                case 'beforeend':
                    container.insertAdjacentElement('beforeend', wrapper);
                    break;
                default:
                    container.appendChild(wrapper);
            }
            
            // 4. 加载CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = config.files.css;
            cssLink.id = `css-${componentId}`;
            document.head.appendChild(cssLink);
            
            // 5. 加载JS
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = config.files.js;
                script.id = `js-${componentId}`;
                script.onload = () => {
                    // 组件加载完成后的回调
                    this.onComponentLoaded(componentId);
                    resolve();
                };
                script.onerror = reject;
                document.body.appendChild(script);
            });
            
            // 保存到已加载列表
            this.loadedComponents.set(componentId, {
                wrapper,
                cssLink: document.getElementById(`css-${componentId}`),
                jsScript: document.getElementById(`js-${componentId}`),
                instance: window[`${componentId.replace('-', '')}Component`]
            });
            
            // 更新状态
            this.setComponentStatus(componentId, 'online');
            
            console.log(`🎉 组件 "${config.name}" 加载成功`);
            return true;
            
        } catch (error) {
            console.error(`加载组件 ${componentId} 失败:`, error);
            this.setComponentStatus(componentId, 'offline');
            
            // 清理残留元素
            this.cleanupFailedComponent(componentId);
            throw error;
        }
    }
    
    // 卸载组件
    unloadComponent(componentId) {
        const component = this.loadedComponents.get(componentId);
        if (!component) return;
        
        try {
            // 1. 调用组件的销毁方法（如果有）
            if (component.instance && typeof component.instance.destroy === 'function') {
                component.instance.destroy();
            }
            
            // 2. 移除HTML
            if (component.wrapper && component.wrapper.parentNode) {
                component.wrapper.parentNode.removeChild(component.wrapper);
            }
            
            // 3. 移除CSS
            if (component.cssLink && component.cssLink.parentNode) {
                component.cssLink.parentNode.removeChild(component.cssLink);
            }
            
            // 4. 移除JS
            if (component.jsScript && component.jsScript.parentNode) {
                component.jsScript.parentNode.removeChild(component.jsScript);
            }
            
            // 5. 清理全局变量
            const globalVarName = `${componentId.replace('-', '')}Component`;
            if (window[globalVarName]) {
                delete window[globalVarName];
            }
            
            // 6. 从已加载列表中移除
            this.loadedComponents.delete(componentId);
            
            console.log(`🗑️ 组件 "${componentId}" 已卸载`);
            
        } catch (error) {
            console.error(`卸载组件 ${componentId} 失败:`, error);
        }
    }
    
    // 组件加载完成后的处理
    onComponentLoaded(componentId) {
        // 这里可以添加组件加载后的自定义逻辑
        const config = this.componentsConfig[componentId];
        
        switch (componentId) {
            case 'header':
                // 头部组件特殊处理
                if (window.headerComponent) {
                    window.headerComponent.setCurrentPage('home');
                }
                break;
                
            case 'seasonal-background':
                // 背景组件特殊处理
                console.log('季节背景组件已加载，当前季节:', window.seasonalBackground?.currentSeason);
                break;
                
            case 'footer':
                // 脚部组件特殊处理
                if (window.footerComponent) {
                    window.footerComponent.setYear(new Date().getFullYear());
                }
                break;
        }
        
        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('componentLoaded', {
            detail: { componentId, name: config.name }
        }));
    }
    
    // 设置组件状态显示
    setComponentStatus(componentId, status) {
        const switchElement = document.querySelector(`[data-component="${componentId}"]`);
        if (!switchElement) return;
        
        const statusIndicator = switchElement.querySelector('.status-indicator');
        const statusText = switchElement.querySelector('.component-status');
        
        if (statusIndicator) {
            statusIndicator.className = `status-indicator status-${status}`;
        }
        
        if (statusText) {
            const statusMap = {
                'loading': '加载中...',
                'online': '已加载',
                'offline': '加载失败'
            };
            statusText.innerHTML = `
                <span class="status-indicator status-${status}"></span>
                ${statusMap[status] || '未知状态'}
            `;
        }
    }
    
    // 清理加载失败的组件
    cleanupFailedComponent(componentId) {
        const elements = [
            document.getElementById(`component-${componentId}`),
            document.getElementById(`css-${componentId}`),
            document.getElementById(`js-${componentId}`)
        ];
        
        elements.forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }
    
    // 根据状态加载所有组件
    loadComponentsByState() {
        Object.keys(this.componentsConfig).forEach(componentId => {
            if (this.componentsConfig[componentId].enabled) {
                this.loadComponent(componentId);
            }
        });
    }
    
    // 保存状态到本地存储
    saveStateToStorage() {
        const state = {};
        Object.keys(this.componentsConfig).forEach(key => {
            state[key] = this.componentsConfig[key].enabled;
        });
        localStorage.setItem('componentStates', JSON.stringify(state));
    }
    
    // 从本地存储加载状态
    loadStateFromStorage() {
        try {
            const savedState = localStorage.getItem('componentStates');
            if (savedState) {
                const state = JSON.parse(savedState);
                Object.keys(state).forEach(key => {
                    if (this.componentsConfig[key]) {
                        this.componentsConfig[key].enabled = state[key];
                    }
                });
            }
        } catch (error) {
            console.error('加载组件状态失败:', error);
        }
    }
    
    // ==================== 公共API ====================
    
    // 获取组件状态
    getComponentState(componentId) {
        return this.componentsConfig[componentId]?.enabled || false;
    }
    
    // 设置组件状态（不自动加载/卸载）
    setComponentState(componentId, enabled) {
        if (this.componentsConfig[componentId]) {
            this.componentsConfig[componentId].enabled = enabled;
            this.updateSwitchUI(componentId);
        }
    }
    
    // 获取所有组件状态
    getAllComponentStates() {
        const states = {};
        Object.keys(this.componentsConfig).forEach(key => {
            states[key] = this.componentsConfig[key].enabled;
        });
        return states;
    }
    
    // 重置所有组件
    async resetAllComponents() {
        // 先卸载所有组件
        for (const componentId of this.loadedComponents.keys()) {
            this.unloadComponent(componentId);
        }
        
        // 重置状态
        Object.keys(this.componentsConfig).forEach(key => {
            this.componentsConfig[key].enabled = false;
        });
        
        // 更新UI
        this.generateSwitches();
        
        console.log('🔄 所有组件已重置');
    }
}

// 创建全局管理器实例
window.componentManager = new ComponentManager();