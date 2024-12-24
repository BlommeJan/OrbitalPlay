-- game.lua
local finished = false
local finishTime = 0

-- New boolean to track whether timer has started
local hasStarted = false
local gameStartTime = 0

function initGame()
    finished = false
    finishTime = 0
    hasStarted = false
    -- We won't set gameStartTime until we first move
    gameStartTime = 0
end

function isGameFinished()
    return finished
end

-- Called every frame from main.lua
function updateGame(dt)
    -- If we haven't started yet and the player tries to move, start the timer
    if (not hasStarted) and wasMovementKeyPressed() then
        hasStarted = true
        gameStartTime = love.timer.getTime()
    end
    
    -- If the timer hasn’t started or we’re finished, no need to check exit
    if (not hasStarted) or finished then
        return
    end

    -- If player's tile is the exit, record finish time
    if isExit(player.x, player.y) then
        finished = true
        finishTime = love.timer.getTime()
    end
end

function drawGameUI()
    love.graphics.setColor(1,1,1)

    if finished then
        local totalTime = finishTime - gameStartTime
        love.graphics.print(
            string.format("Finished in %.2f seconds!", totalTime),
            10, 10
        )

        local w = love.graphics.getWidth()
        local h = love.graphics.getHeight()
        local msg = "FINISHED!\nPress [Enter] to restart."
        love.graphics.printf(msg, 0, h/2 - 20, w, "center")

    else
        -- If we haven't started the timer, just display "Time: 0.00"
        if not hasStarted then
            love.graphics.print("Time: 0.00", 10, 10)
        else
            -- Timer is running
            local currentTime = love.timer.getTime()
            local elapsed = currentTime - gameStartTime
            love.graphics.print(
                string.format("Time: %.2f", elapsed),
                10, 10
            )
        end
    end
end

function resetGame()
    finished = false
    finishTime = 0
    hasStarted = false
    gameStartTime = 0

    -- Move player back to start
    player.x = 1.5
    player.y = 1.5
    player.angle = 0
end
