/**
 * 组件HTML加载器
 * 用法：<div data-component="header"></div>
 */

class ComponentLoader {
    constructor() {
        this.components = {
            'seasonal-background': {
                html: '/frontend/components/seasonal-background/seasonal-background.html',
                css: '/frontend/components/seasonal-background/seasonal-background.css',
                js: '/frontend/components/seasonal-background/seasonal-background.js'
            },
            'header': {
                html: '/frontend/components/header/header.html',
                css: '/frontend/components/header/header.css',
                js: '/frontend/components/header/header.js'
            },
            'footer': {
                html: '/frontend/components/footer/footer.html',
                css: '/frontend/components/footer/footer.css',
                js: '/frontend/components/footer/footer.js'
            }
        };
        
        this.init();
    }
    
    async init() {
        // 自动加载所有标记的组件
        await this.loadAllComponents();
    }
    
    async loadAllComponents() {
        const componentElements = document.querySelectorAll('[data-component]');
        
        for (const element of componentElements) {
            const componentName = element.getAttribute('data-component');
            await this.loadComponent(componentName, element);
        }
    }
    
    async loadComponent(componentName, container) {
        const config = this.components[componentName];
        if (!config) {
            console.error(`组件 ${componentName} 未定义`);
            return;
        }
        
        try {
            console.log(`正在加载组件: ${componentName}`);
            
            // 1. 加载HTML
            const response = await fetch(config.html);
            const html = await response.text();
            
            // 2. 插入HTML
            container.innerHTML = html;
            
            // 3. 加载CSS（如果还没加载）
            if (!document.querySelector(`link[href="${config.css}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = config.css;
                document.head.appendChild(link);
            }
            
            // 4. 加载JS（如果还没加载）
            if (!document.querySelector(`script[src="${config.js}"]`)) {
                await this.loadScript(config.js);
            }
            
            console.log(`组件 ${componentName} 加载完成`);
            
        } catch (error) {
            console.error(`加载组件 ${componentName} 失败:`, error);
            container.innerHTML = `<div style="color: red; padding: 20px; border: 2px dashed red;">
                <strong>组件加载失败:</strong> ${componentName}<br>
                ${error.message}
            </div>`;
        }
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader = new ComponentLoader();
});