// 手机游戏JavaScript
class MobileShooter {
    constructor() {
        this.gameState = {
            score: 0,
            health: 100,
            ammo: 30,
            enemies: 5,
            playerX: 100,
            playerY: 200,
            enemyX: 400,
            enemyY: 200,
            bullets: [],
            gameStarted: false
        };
        
        this.canvas = null;
        this.context = null;
        this.lastTouch = null;
    }
    
    init() {
        // 初始化Canvas
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');
        
        // 添加触摸事件
        this.setupTouchControls();
        
        // 初始绘制
        this.drawInitialScreen();
        
        // 更新尺寸显示
        this.updateScreenSize();
    }
    
    setupTouchControls() {
        // 触摸移动
        this.canvas.addEventListener('touchstart', (e) => {
            this.lastTouch = e.touches[0];
            
            // 根据触摸位置判断操作
            const touchX = this.lastTouch.clientX;
            const touchY = this.lastTouch.clientY;
            
            // 检查触摸区域
            if (touchX < this.canvas.width / 2) {
                // 左侧：移动控制
                this.handleTouchMovement(touchX, touchY);
            } else {
                // 右侧：射击控制
                this.shoot();
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.lastTouch) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.lastTouch.clientX;
                const deltaY = touch.clientY - this.lastTouch.clientY;
                
                // 移动玩家
                this.gameState.playerX += deltaX;
                this.gameState.playerY += deltaY;
                
                this.lastTouch = touch;
            }
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.lastTouch = null;
        });
    }
    
    handleTouchMovement(x, y) {
        // 虚拟摇杆移动
        const centerX = this.canvas.width / 4;
        const centerY = this.canvas.height / 2;
        
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        
        // 移动速度和方向
        if (deltaX > 20) {
            this.gameState.playerX += 10;
        } else if (deltaX < -20) {
            this.gameState.playerX -= 10;
        }
        
        if (deltaY > 20) {
            this.gameState.playerY += 10;
        } else if (deltaY < -20) {
            this.gameState.playerY -= 10;
        }
        
        // 边界检查
        this.gameState.playerX = Math.max(0, Math.min(this.canvas.width - 20, this.gameState.playerX));
        this.gameState.playerY = Math.max(0, Math.min(this.canvas.height - 20, this.gameState.playerY));
    }
    
    startGame() {
        this.gameState.gameStarted = true;
        this.gameState.score = 0;
        this.gameState.health = 100;
        this.gameState.ammo = 30;
        this.gameState.enemies = 5;
        this.gameState.bullets = [];
        
        this.updateStats();
        
        // 开始游戏循环
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.gameState.gameStarted) return;
        
        // 绘制游戏
        this.drawGame();
        
        // 更新游戏逻辑
        this.updateGameLogic();
        
        // 继续循环
        setTimeout(() => {
            this.gameLoop();
        }, 100);
    }
    
    drawGame() {
        // 绘制背景
        this.context.fillStyle = '#222';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制玩家
        this.context.fillStyle = '#00ff00';
        this.context.fillRect(this.gameState.playerX, this.gameState.playerY, 20, 20);
        
        // 绘制敌人
        this.context.fillStyle = '#ff0000';
        this.context.fillRect(this.gameState.enemyX, this.gameState.enemyY, 20, 20);
        
        // 绘制子弹
        this.context.fillStyle = '#ffff00';
        this.gameState.bullets.forEach(bullet => {
            this.context.fillRect(bullet.x, bullet.y, 10, 10);
            bullet.x += 5;
        });
        
        // 绘制触摸控制区域
        this.drawControlAreas();
    }
    
    drawControlAreas() {
        // 移动控制区域（左侧）
        this.context.fillStyle = 'rgba(30, 30, 60, 0.5)';
        this.context.fillRect(0, 0, this.canvas.width / 2, this.canvas.height);
        
        // 射击区域（右侧）
        this.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.context.fillRect(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height);
        
        // 控制指示文字
        this.context.fillStyle = '#fff';
        this.context.font = '14px Arial';
        this.context.fillText('Move Here', this.canvas.width / 4, 20);
        this.context.fillText('Shoot Here', this.canvas.width * 0.75, 20);
    }
    
    updateGameLogic() {
        // 敌人移动
        if (this.gameState.enemyX > this.gameState.playerX) {
            this.gameState.enemyX -= 1;
        } else {
            this.gameState.enemyX += 1;
        }
        
        if (this.gameState.enemyY > this.gameState.playerY) {
            this.gameState.enemyY -= 1;
        } else {
            this.gameState.enemyY += 1;
        }
        
        // 子弹碰撞检测
        this.gameState.bullets.forEach(bullet => {
            if (Math.abs(bullet.x - this.gameState.enemyX) < 15 && Math.abs(bullet.y - this.gameState.enemyY) < 15) {
                this.gameState.enemies--;
                this.gameState.score += 100;
                this.gameState.bullets.splice(this.gameState.bullets.indexOf(bullet), 1);
                this.updateStats();
                
                // 重新生成敌人
                if (this.gameState.enemies > 0) {
                    this.gameState.enemyX = Math.random() * this.canvas.width;
                    this.gameState.enemyY = Math.random() * this.canvas.height;
                }
            }
            
            // 子弹超出边界
            if (bullet.x > this.canvas.width) {
                this.gameState.bullets.splice(this.gameState.bullets.indexOf(bullet), 1);
            }
        });
        
        // 敌人碰撞检测
        if (Math.abs(this.gameState.enemyX - this.gameState.playerX) < 20 && 
            Math.abs(this.gameState.enemyY - this.gameState.playerY) < 20) {
            this.gameState.health -= 5;
            this.updateStats();
            
            if (this.gameState.health <= 0) {
                this.gameOver();
            }
        }
        
        // 游戏状态检查
        if (this.gameState.health <= 0) {
            this.gameOver();
        }
        
        if (this.gameState.enemies <= 0) {
            this.winGame();
        }
    }
    
    shoot() {
        if (!this.gameState.gameStarted || this.gameState.ammo <= 0) return;
        
        this.gameState.ammo--;
        this.gameState.bullets.push({
            x: this.gameState.playerX + 10,
            y: this.gameState.playerY
        });
        
        this.updateStats();
    }
    
    jump() {
        if (!this.gameState.gameStarted) return;
        
        // 跳跃动画
        this.gameState.playerY -= 30;
        setTimeout(() => {
            this.gameState.playerY += 30;
        }, 500);
    }
    
    move(direction) {
        if (!this.gameState.gameStarted) return;
        
        switch(direction) {
            case 'forward':
                this.gameState.playerY -= 20;
                break;
            case 'backward':
                this.gameState.playerY += 20;
                break;
            case 'left':
                this.gameState.playerX -= 20;
                break;
            case 'right':
                this.gameState.playerX += 20;
                break;
        }
        
        // 边界检查
        this.gameState.playerX = Math.max(0, Math.min(this.canvas.width - 20, this.gameState.playerX));
        this.gameState.playerY = Math.max(0, Math.min(this.canvas.height - 20, this.gameState.playerY));
    }
    
    switchWeapon(num) {
        if (!this.gameState.gameStarted) return;
        
        // 武器切换逻辑
        switch(num) {
            case 1:
                this.gameState.ammo = 30;
                break;
            case 2:
                this.gameState.ammo = 20;
                break;
            case 3:
                this.gameState.ammo = 50;
                break;
        }
        
        this.updateStats();
    }
    
    pauseGame() {
        this.gameState.gameStarted = false;
    }
    
    resetGame() {
        this.gameState.gameStarted = false;
        this.gameState.score = 0;
        this.gameState.health = 100;
        this.gameState.ammo = 30;
        this.gameState.enemies = 5;
        this.gameState.playerX = 100;
        this.gameState.playerY = 200;
        this.gameState.enemyX = 400;
        this.gameState.enemyY = 200;
        this.gameState.bullets = [];
        
        this.updateStats();
        
        this.drawInitialScreen();
    }
    
    gameOver() {
        this.gameState.gameStarted = false;
        
        this.context.fillStyle = '#ff0000';
        this.context.font = '24px Arial';
        this.context.fillText('Game Over!', 100, 200);
        
        // 显示分数
        this.context.fillStyle = '#fff';
        this.context.font = '18px Arial';
        this.context.fillText(`Final Score: ${this.gameState.score}`, 100, 230);
    }
    
    winGame() {
        this.gameState.gameStarted = false;
        
        this.context.fillStyle = '#00ff00';
        this.context.font = '24px Arial';
        this.context.fillText('Victory!', 100, 200);
        
        // 显示分数
        this.context.fillStyle = '#fff';
        this.context.font = '18px Arial';
        this.context.fillText(`Final Score: ${this.gameState.score}`, 100, 230);
    }
    
    updateStats() {
        const scoreElement = document.getElementById('score');
        const healthElement = document.getElementById('health');
        const enemiesElement = document.getElementById('enemies');
        const ammoElement = document.getElementById('ammo');
        
        if (scoreElement) scoreElement.textContent = this.gameState.score;
        if (healthElement) healthElement.textContent = this.gameState.health;
        if (enemiesElement) enemiesElement.textContent = this.gameState.enemies;
        if (ammoElement) ammoElement.textContent = this.gameState.ammo;
    }
    
    updateScreenSize() {
        const widthElement = document.getElementById('screenWidth');
        const heightElement = document.getElementById('screenHeight');
        
        if (widthElement) widthElement.textContent = window.innerWidth;
        if (heightElement) heightElement.textContent = window.innerHeight;
    }
    
    drawInitialScreen() {
        this.context.fillStyle = '#222';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.context.fillStyle = '#fff';
        this.context.font = '18px Arial';
        this.context.fillText('Touch-Friendly Mobile Shooting Game', 100, 200);
    }
}

// 创建游戏实例
const game = new MobileShooter();

// 初始化游戏
window.onload = function() {
    game.init();
};

// 暴露全局函数
function startGame() {
    game.startGame();
}

function pauseGame() {
    game.pauseGame();
}

function resetGame() {
    game.resetGame();
}

function move(direction) {
    game.move(direction);
}

function jump() {
    game.jump();
}

function shoot() {
    game.shoot();
}

function switchWeapon(num) {
    game.switchWeapon(num);
}