-- main.lua
local Player = require("player")
local Zombie = require("zombie")
local Bullet = require("bullet")
local Utils = require("utils")
local Menu = require("menu")

-- Define game states
local GAMESTATE = {
    MENU = "MENU",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
    GAMEOVER = "GAMEOVER"
}

local currentState
local menu

-- Define spawn interval parameters
local baseSpawnInterval = 2           -- Initial spawn interval in seconds
local minSpawnInterval = 0.5          -- Minimum spawn interval in seconds
local spawnRateFactor = 0.01          -- How much to decrease spawn interval per wave

-- Wave system parameters
local wave = 1
local nextWaveScore = 10  -- Score at which to increase the wave

local function calculateSpawnIntervalWave(score)
    -- Check if score has reached the threshold for the next wave
    if score >= nextWaveScore then
        wave = wave + 1
        nextWaveScore = nextWaveScore * 2  -- Increment the threshold
    end
    
    -- Decrease spawn interval based on the current wave
    local newInterval = baseSpawnInterval - ((wave - 1) * spawnRateFactor)
    
    -- Ensure spawn interval doesn't go below minimum
    if newInterval < minSpawnInterval then
        newInterval = minSpawnInterval
    end
    return newInterval
end

function love.load()
    -- Load assets
    background = love.graphics.newImage("assets/images/background.png")
    
    -- Initialize player
    player = Player:new()
    
    -- Tables to hold zombies and bullets
    zombies = {}
    bullets = {}
    
    -- Spawn timer
    spawnTimer = 0
    
    -- Load sounds
    shootSound = love.audio.newSource("assets/sounds/shoot.mp3", "static")
    zombieDeathSound = love.audio.newSource("assets/sounds/zombie_death.wav", "static")
    
    -- Initialize score
    score = 0
    
    -- Game state
    currentState = GAMESTATE.MENU
    menu = Menu:new()
    
    -- Initialize fonts
    uiFont = love.graphics.newFont(24)
    gameOverFont = love.graphics.newFont(40)
    menuTitleFont = love.graphics.newFont(40)
    menuSubtitleFont = love.graphics.newFont(20)
end

function love.update(dt)
    if currentState == GAMESTATE.PLAYING then
        player:update(dt)
        
        -- Update zombies
        for i = #zombies, 1, -1 do -- Iterate backwards to avoid skipping elements when removing
            local z = zombies[i]
            z:update(dt, player)
            
            -- Check collision with player
            if Utils.circleCollision(player.x, player.y, player.radius, z.x, z.y, z.radius) then
                player.health = player.health - 100 * dt  -- Reduce health over time
                if player.health <= 0 then
                    player.health = 0
                    currentState = GAMESTATE.GAMEOVER
                end
            end
        end
        
        -- Update bullets
        for i = #bullets, 1, -1 do
            local b = bullets[i]
            b:update(dt)
            
            -- Remove bullets that are off-screen
            if b.x < 0 or b.x > love.graphics.getWidth() or b.y < 0 or b.y > love.graphics.getHeight() then
                table.remove(bullets, i)
            else
                -- Check collision with zombies
                for j = #zombies, 1, -1 do
                    local z = zombies[j]
                    if Utils.circleCollision(b.x, b.y, b.radius, z.x, z.y, z.radius) then
                        zombieDeathSound:play()
                        table.remove(zombies, j)
                        table.remove(bullets, i)
                        score = score + 1
                        break
                    end
                end
            end
        end
        
        -- Dynamic spawn interval based on wave
        local currentSpawnInterval = calculateSpawnIntervalWave(score)
        
        -- Update spawn timer
        spawnTimer = spawnTimer + dt
        if spawnTimer >= currentSpawnInterval then
            -- Spawn multiple zombies based on wave
            local zombiesToSpawn = wave  -- Spawn number equal to the current wave
            for i = 1, zombiesToSpawn do
                table.insert(zombies, Zombie:new())
            end
            spawnTimer = 0
        end
    elseif currentState == GAMESTATE.PAUSED then
        -- Game is paused; no updates
    elseif currentState == GAMESTATE.MENU then
        -- Menu updates if any
    elseif currentState == GAMESTATE.GAMEOVER then
        -- Game Over state updates if any
    end
end

function love.draw()
    if currentState == GAMESTATE.MENU then
        menu:draw()
    else
        love.graphics.draw(background, 0, 0)
        player:draw()
        
        for _, z in ipairs(zombies) do
            z:draw()
        end
        
        for _, b in ipairs(bullets) do
            b:draw()
        end
        
        -- Draw UI elements
        love.graphics.setFont(uiFont)
        love.graphics.setColor(0, 0, 0, 1)
        love.graphics.rectangle("fill", 0, 0, 200, 110)
        love.graphics.setColor(1, 1, 1, 1)
        love.graphics.print("Score: " .. score, 10, 10)
        love.graphics.print("Health: " .. math.floor(player.health), 10, 40)
        love.graphics.print("Wave: " .. wave, 10, 70)
        
        if currentState == GAMESTATE.PAUSED then
            love.graphics.setFont(gameOverFont)
            love.graphics.printf("PAUSED", 0, love.graphics.getHeight() / 2 - 20, love.graphics.getWidth(), "center")
            love.graphics.setFont(uiFont)
            love.graphics.printf("Press 'P' to Resume", 0, love.graphics.getHeight() / 2 + 20, love.graphics.getWidth(), "center")
        elseif currentState == GAMESTATE.GAMEOVER then
            love.graphics.setColor(0 , 0, 0, 0.5)
            love.graphics.rectangle("fill", 0, 0, love.graphics.getWidth(), love.graphics.getHeight())
            love.graphics.setColor(1, 1, 1, 1)
            love.graphics.setFont(gameOverFont)
            love.graphics.printf("GAME OVER", 0, love.graphics.getHeight() / 2 - 20, love.graphics.getWidth(), "center")
            love.graphics.setFont(uiFont)
            love.graphics.printf("Score: " .. score, 0, love.graphics.getHeight() / 2 + 40, love.graphics.getWidth(), "center")
            love.graphics.printf("Press 'R' to Restart or 'Escape' to Quit", 0, love.graphics.getHeight() / 2 + 80, love.graphics.getWidth(), "center")
        end
    end
end

function love.mousepressed(x, y, button, istouch, presses)
    if currentState == GAMESTATE.PLAYING then
        if button == 1 then  -- Left mouse button
            local bullet = Bullet:new(player.x, player.y, x, y)
            table.insert(bullets, bullet)
            
            -- Clone and play a new instance of the shoot sound
            local shootInstance = shootSound:clone()
            shootInstance:play()
        end
    end
end

function love.keypressed(key)
    if currentState == GAMESTATE.MENU then
        -- Handle menu key presses
        local newState = menu:keypressed(key)
        if newState then
            currentState = newState
            -- Reset game if starting from menu
            if currentState == GAMESTATE.PLAYING then
                restartGame()
            end
        end
    elseif currentState == GAMESTATE.PLAYING then
        if key == "p" then
            currentState = GAMESTATE.PAUSED
        end
    elseif currentState == GAMESTATE.PAUSED then
        if key == "p" then
            currentState = GAMESTATE.PLAYING
        end
    elseif currentState == GAMESTATE.GAMEOVER then
        if key == "r" then
            restartGame()
            currentState = GAMESTATE.PLAYING
        elseif key == "escape" then
            love.event.quit()
        end
    end
end

function restartGame()
    -- Reset game state
    player.x = love.graphics.getWidth() / 2
    player.y = love.graphics.getHeight() / 2
    player.health = 100
    score = 0
    zombies = {}
    bullets = {}
    spawnTimer = 0
    
    -- Reset wave system
    wave = 1
    nextWaveScore = 10
end
