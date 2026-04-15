# 3D射击游戏原型安装指南

## 步骤1：安装Unity
1. 下载Unity Hub：[https://unity.com/download](https://unity.com/download)
2. 安装Unity 2022.3或2023版本
3. 在Unity Hub中创建新项目

## 步骤2：设置项目结构
1. 在Unity中创建以下文件夹：
   - Assets/Scripts
   - Assets/Scenes
   - Assets/Models
   - Assets/Prefabs

2. 将所有脚本文件复制到Assets/Scripts文件夹

## 步骤3：创建游戏场景
1. 新建场景文件：Assets/Scenes/GameScene.unity
2. 添加以下游戏对象：

### 玩家控制器：
- GameObject命名为"Player"
- 添加Rigidbody组件
- 添加PlayerController脚本
- 添加PlayerHealth脚本
- 添加WeaponManager脚本
- 添加Camera作为子对象

### 敌人预制体：
- GameObject命名为"Enemy"
- 添加Rigidbody组件
- 添加EnemyAI或SimpleEnemy脚本
- Tag设为"Enemy"

### 子弹预制体：
- GameObject命名为"Bullet"
- 添加Rigidbody组件
- 添加Bullet脚本
- Tag设为"Bullet"

## 步骤4：UI设置
1. 创建Canvas
2. 添加UI元素：
   - Text ScoreText
   - Text HealthText
   - Panel GameOverPanel
   - Panel WinPanel

3. 将GameManager脚本挂载到GameObject

## 步骤5：设置物理和碰撞
1. 在Bullet预制体上添加Sphere Collider
2. 在Enemy预制体上添加Box Collider
3. 设置Layer：
   - Player层
   - Enemy层
   - Bullet层

## 步骤6：运行测试
1. 点击Play按钮运行游戏
2. 测试功能：
   - WASD移动
   - 鼠标瞄准
   - 鼠标左键射击
   - 空格键跳跃
   - 敌人AI行为
   - 分数系统

## 快速启动脚本
如果需要快速启动Unity项目，可以使用以下命令行：

```bash
# 创建Unity项目
mkdir Unity3DShooter
cd Unity3DShooter
# 复制脚本文件到Assets/Scripts目录
```

## 注意事项
1. 确保所有脚本都正确连接到对应游戏对象
2. Tag设置要一致（Player, Enemy）
3. 调整相机位置和FOV以获得更好的视角
4. 可添加光照系统提高视觉效果