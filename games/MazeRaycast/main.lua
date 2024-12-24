-- main.lua
-- Entry point for our Wolfenstein-like Raycasting Game

-- Require our modules
require("player")
require("map")
require("raycast")
require("game")

function love.load()
    -- Basic window settings
    love.window.setTitle("Raycasting Maze with Timer")
    love.window.setMode(800, 600, {resizable = false})

    -- Hide the mouse cursor, and set it to the center of the screen
    screenWidth = love.graphics.getWidth()
    screenHeight = love.graphics.getHeight()
    centerX, centerY = screenWidth / 2, screenHeight / 2
    love.mouse.setVisible(false)
    love.mouse.setPosition(centerX, centerY)

    -- Load the wall texture
    wallTexture = love.graphics.newImage("assets/wall.png")

    -- Initialize the player (from player.lua)
    initPlayer()

    -- Initialize game logic (timer, etc.)
    initGame()
end

function love.update(dt)
    -- Update the mouse delta manually (for turning)
    local mx, my = love.mouse.getPosition()
    local dx = mx - centerX
    local dy = my - centerY
    love.mouse.setPosition(centerX, centerY)

    -- Update player movement and turning
    updatePlayer(dt, dx, dy)

    -- Update the timer and check for exit tile
    updateGame(dt)
end

function love.draw()
    -- Draw the scene via raycasting
    drawScene()

    -- Draw the timer and any messages (from game.lua)
    drawGameUI()
end

function love.keypressed(key)
    if key == "escape" then
        love.event.quit()
    end

    if key == "return" and isGameFinished() then
        resetGame()
    end
end
