#!/usr/bin/env python3
"""
3D射击游戏原型快速启动脚本
这是一个简单的Python脚本，可以在没有Unity的情况下演示游戏逻辑
"""

import random
import time
import sys

class Player:
    def __init__(self):
        self.health = 100
        self.position = [0, 0]
        self.ammo = 30
        
    def move(self, direction):
        if direction == "forward":
            self.position[1] += 1
        elif direction == "backward":
            self.position[1] -= 1
        elif direction == "left":
            self.position[0] -= 1
        elif direction == "right":
            self.position[0] += 1
        print(f"Player moved {direction} to ({self.position[0]}, {self.position[1]})")
    
    def shoot(self):
        if self.ammo > 0:
            self.ammo -= 1
            print(f"Player shoots! Ammo remaining: {self.ammo}")
            return True
        else:
            print("No ammo!")
            return False
    
    def take_damage(self, damage):
        self.health -= damage
        print(f"Player took {damage} damage! Health: {self.health}")
        return self.health > 0

class Enemy:
    def __init__(self, position):
        self.health = 50
        self.position = position
    
    def move(self, player_position):
        dx = player_position[0] - self.position[0]
        dy = player_position[1] - self.position[1]
        
        if abs(dx) > abs(dy):
            self.position[0] += 1 if dx > 0 else -1
        else:
            self.position[1] += 1 if dy > 0 else -1
        
        print(f"Enemy moved to ({self.position[0]}, {self.position[1]})")
    
    def attack(self):
        print("Enemy attacks!")
        return random.randint(5, 15)
    
    def take_damage(self, damage):
        self.health -= damage
        print(f"Enemy took {damage} damage! Health: {self.health}")
        return self.health > 0

class GameManager:
    def __init__(self):
        self.player = Player()
        self.enemies = []
        self.score = 0
        
    def spawn_enemies(self, count):
        for i in range(count):
            enemy_position = [
                random.randint(-5, 5),
                random.randint(-5, 5)
            ]
            self.enemies.append(Enemy(enemy_position))
        print(f"Spawned {count} enemies")
    
    def check_distance(self):
        for enemy in self.enemies:
            distance = abs(enemy.position[0] - self.player.position[0]) + \
                      abs(enemy.position[1] - self.player.position[1])
            if distance <= 2:
                damage = enemy.attack()
                if self.player.take_damage(damage):
                    return True
                else:
                    print("Player died!")
                    return False
    
    def update(self):
        # 敌人移动
        for enemy in self.enemies:
            if enemy.health > 0:
                enemy.move(self.player.position)
        
        # 检查距离和攻击
        if not self.check_distance():
            return False
        
        # 射击
        if self.player.shoot():
            # 随机击中敌人
            if len(self.enemies) > 0:
                target_enemy = random.choice(self.enemies)
                if target_enemy.take_damage(random.randint(10, 20)):
                    pass
                else:
                    self.score += 100
                    self.enemies.remove(target_enemy)
                    print(f"Enemy defeated! Score: {self.score}")
        
        return True
    
    def display_status(self):
        print(f"\n=== Game Status ===")
        print(f"Player Health: {self.player.health}")
        print(f"Player Ammo: {self.player.ammo}")
        print(f"Player Position: ({self.player.position[0]}, {self.player.position[1]})")
        print(f"Enemies: {len(self.enemies)}")
        print(f"Score: {self.score}")
        print("===================\n")

def main():
    print("3D Shooting Game Prototype")
    print("==========================")
    
    game = GameManager()
    game.spawn_enemies(3)
    
    while True:
        game.display_status()
        
        print("Available actions:")
        print("1. Move forward")
        print("2. Move backward")
        print("3. Move left")
        print("4. Move right")
        print("5. Shoot")
        print("6. Exit")
        
        choice = input("Choose action (1-6): ")
        
        if choice == "1":
            game.player.move("forward")
        elif choice == "2":
            game.player.move("backward")
        elif choice == "3":
            game.player.move("left")
        elif choice == "4":
            game.player.move("right")
        elif choice == "5":
            game.player.shoot()
        elif choice == "6":
            print("Exiting game...")
            break
        
        # 更新游戏状态
        if not game.update():
            print("Game Over!")
            break
        
        time.sleep(1)

if __name__ == "__main__":
    main()