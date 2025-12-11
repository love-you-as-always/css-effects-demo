
// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 clipboard.js
    var clipboard = new ClipboardJS('.copy-btn', {
        text: function(trigger) {
            // 根据卡片序号获取对应的 CSS 代码
            const card = trigger.closest('.effect-card');
            const number = card.querySelector('.effect-number').textContent;
            return getCssCode(number);
        }
    });
    
    // 成功复制时的提示
    clipboard.on('success', function(e) {
        e.trigger.innerHTML = '<i class="fas fa-check"></i> 已复制！';
        e.trigger.style.background = 'rgba(0, 255, 100, 0.2)';
        e.trigger.style.borderColor = '#00ff64';
        
        // 2秒后恢复原状
        setTimeout(function() {
            e.trigger.innerHTML = '<i class="fas fa-copy"></i> 复制代码';
            e.trigger.style.background = '';
            e.trigger.style.borderColor = '';
        }, 2000);
        
        e.clearSelection();
    });
    
    // 复制失败时的提示
    clipboard.on('error', function(e) {
        e.trigger.innerHTML = '<i class="fas fa-times"></i> 复制失败';
        e.trigger.style.background = 'rgba(255, 0, 0, 0.2)';
        e.trigger.style.borderColor = '#ff0000';
        
        setTimeout(function() {
            e.trigger.innerHTML = '<i class="fas fa-copy"></i> 复制代码';
            e.trigger.style.background = '';
            e.trigger.style.borderColor = '';
        }, 2000);
    });
    
    // 定义每个特效的 CSS 代码
    function getCssCode(number) {
        const codes = {
            '1': `/* 霓虹发光按钮 */
    <button class="neon-btn">以光试试</button>
    .neon-btn {
    padding: 15px 40px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
        0 0 5px #0ff,
        0 0 10px #0ff,
        0 0 15px #0ff,
        0 0 20px #0ff;
    animation: neon-pulse 1.5s ease-in-out infinite alternate;
}

@keyframes neon-pulse {
    from {
        box-shadow: 
            0 0 5px #0ff,
            0 0 10px #0ff,
            0 0 15px #0ff,
            0 0 20px #0ff;
    }
    to {
        box-shadow: 
            0 0 10px #0ff,
            0 0 20px #0ff,
            0 0 30px #0ff,
            0 0 40px #0ff;
    }
}`,
            '2': `/* 渐变文字动画 */
            <div class="gradient-text">渐变文字效果</div>
.gradient-text {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(
        45deg,
        #ff0000, #ff9900, #ffff00, #33ff00,
        #0099ff, #6633ff, #ff00ff
    );
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-flow 5s ease infinite;
}

@keyframes gradient-flow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}`,
            '3': `/* 旋转加载动画 */
            <div class="spinner"></div>
.spinner {
    width: 80px;
    height: 80px;
    border: 8px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: #ff0080;
    border-right-color: #00ffcc;
    border-bottom-color: #ff9900;
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`,
            '4': `/* 卡片悬停3D翻转 */
            <div class="flip-card">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <span>正面</span>
                            </div>
                            <div class="flip-card-back">
                                <span>背面</span>
                            </div>
                        </div>
                    </div>
.flip-card {
    width: 200px;
    height: 150px;
    perspective: 1000px;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
}

.flip-card-front {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.flip-card-back {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    transform: rotateY(180deg);
}`,
            '5': `/* 输入框聚焦动画 */
             <input type="text" class="animated-input" placeholder="点击输入...">
.animated-input {
    width: 250px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.animated-input:focus {
    outline: none;
    border-color: #00ffcc;
    box-shadow: 0 0 20px rgba(0, 255, 204, 0.4);
    transform: scale(1.02);
}`,
            '6': `/* 波浪文字效果 */
            <div class="wave-text">
                        <span style="--i:1">波</span>
                        <span style="--i:2">浪</span>
                        <span style="--i:3">文</span>
                        <span style="--i:4">字</span>
                        <span style="--i:5">效</span>
                        <span style="--i:6">果</span>
                    </div>
.wave-text {
    font-size: 2.2rem;
    font-weight: 700;
}

.wave-text span {
    display: inline-block;
    animation: wave 2s ease-in-out infinite;
    animation-delay: calc(0.1s * var(--i));
}

@keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}`,
            '7': `/* 打字机文字效果 */
            <div class="typewriter">CSS特效展示</div>
.typewriter {
    font-size: 1.8rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    border-right: 3px solid white;
    animation: 
        typing 3.5s steps(20, end) infinite,
        blink-caret 0.75s step-end infinite;
}

@keyframes typing {
    0% { width: 0 }
    50% { width: 100% }
    80% { width: 100% }
    100% { width: 0 }
}

@keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: white }
}`,
            '8': `/* 进度条加载动画 */
            <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
.progress-container {
    width: 250px;
    height: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    overflow: hidden;
    position: relative;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ff0080, #00ffcc);
    border-radius: 15px;
    animation: progress-loading 2s ease-in-out infinite;
}

@keyframes progress-loading {
    0% { width: 0%; }
    50% { width: 100%; }
    100% { width: 0%; }
}`
        };
        
        return codes[number] || '/* 代码未找到 */';
    }
});
