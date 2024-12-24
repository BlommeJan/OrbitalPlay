-- main.lua

function love.load()
    setupGame()

    -- Load assets
    background = love.graphics.newImage("assets/images/background.png") -- Background image
    targetImage = love.graphics.newImage("assets/images/target.png") -- Target image

    gameFont = love.graphics.newFont(40)

    -- Load sound effects
    hitSound = love.audio.newSource("assets/sounds/hit.wav", "static") -- Sound on target hit
    gameOverSound = love.audio.newSource("assets/sounds/gameover.wav", "static") -- Sound on game over
end

function setupGame()
    -- Initialize game state
    target = { x = 300, y = 300, radius = 50 }
    score = 0
    timer = 10
    gameOver = false
end

function love.update(dt)
    if timer > 0 then
        timer = timer - dt
        if timer < 0 then
            timer = 0
            gameOver = true
            love.audio.play(gameOverSound)
        end
    end
end

function love.draw()
    -- Draw background
    love.graphics.draw(background, 0, 0, 0, love.graphics.getWidth() / background:getWidth(), love.graphics.getHeight() / background:getHeight())

    if timer > 0 then
        -- Draw target image
        love.graphics.draw(targetImage, target.x - target.radius, target.y - target.radius, 0, target.radius * 2 / targetImage:getWidth(), target.radius * 2 / targetImage:getHeight())

        -- Score display
        love.graphics.setColor(1, 1, 1)
        love.graphics.setFont(gameFont)
        love.graphics.print("Score: " .. score, 10, 10)

        -- Timer display
        love.graphics.print("Time: " .. math.ceil(timer), love.graphics.getWidth() - 150, 10)
    else
        -- Game over screen
        love.graphics.setColor(1, 1, 1)
        love.graphics.setFont(gameFont)
        love.graphics.printf("Game Over! Final Score: " .. score, 0, love.graphics.getHeight() / 2 - 40, love.graphics.getWidth(), "center")

        -- Draw replay button
        drawReplayButton()
    end
end

function love.mousepressed(x, y, button, istouch, presses)
    if gameOver then
        -- Check if the replay button is clicked
        if button == 1 and isPointInButton(x, y) then
            setupGame() -- Reset the game
        end
    elseif button == 1 and timer > 0 then
        -- Check if target is hit
        if distanceBetween(x, y, target.x, target.y) < target.radius then
            score = score + 1
            timer = timer + 1 -- Add a second to the timer
            love.audio.play(hitSound) -- Play hit sound

            -- Randomize target position and size
            target.radius = math.random(20, 50)
            target.x = math.random(target.radius, love.graphics.getWidth() - target.radius)
            target.y = math.random(target.radius, love.graphics.getHeight() - target.radius)
        end
    end
end

function distanceBetween(x1, y1, x2, y2)
    return math.sqrt((x2 - x1)^2 + (y2 - y1)^2)
end

function drawReplayButton()
    local buttonWidth = 200
    local buttonHeight = 60
    local buttonX = (love.graphics.getWidth() - buttonWidth) / 2
    local buttonY = love.graphics.getHeight() / 2 + 50

    -- Draw button background
    love.graphics.setColor(0.5, 0, 0)
    love.graphics.rectangle("fill", buttonX, buttonY, buttonWidth, buttonHeight, 10, 10)

    -- Draw button text
    love.graphics.setColor(1, 1, 1)
    love.graphics.printf("Replay", buttonX, buttonY + 15, buttonWidth, "center")
end

function isPointInButton(x, y)
    local buttonWidth = 200
    local buttonHeight = 60
    local buttonX = (love.graphics.getWidth() - buttonWidth) / 2
    local buttonY = love.graphics.getHeight() / 2 + 50

    return x >= buttonX and x <= buttonX + buttonWidth and y >= buttonY and y <= buttonY + buttonHeight
end

function love.resize(w, h)
    -- Optimize font and button resizing
    gameFont = love.graphics.newFont(math.min(w, h) / 20)
end
