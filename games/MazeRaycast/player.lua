-- player.lua
player = {
    x = 1.5,
    y = 1.5,
    angle = 0,
    fov = math.pi / 3,
    moveSpeed = 3
}

function initPlayer()
    player.x = 1.5
    player.y = 1.5
    player.angle = 0
end

function updatePlayer(dt, dx, dy)
    -- 1) Mouse turning
    local mouseSensitivity = 0.002
    player.angle = player.angle + dx * mouseSensitivity

    if player.angle < 0 then
        player.angle = player.angle + math.pi * 2
    elseif player.angle >= math.pi * 2 then
        player.angle = player.angle - math.pi * 2
    end

    -- 2) Movement
    local moveX, moveY = 0, 0

    local forwardX = math.cos(player.angle)
    local forwardY = math.sin(player.angle)
    local strafeX  = math.cos(player.angle + math.pi / 2)
    local strafeY  = math.sin(player.angle + math.pi / 2)

    if love.keyboard.isDown("w") then
        moveX = moveX + forwardX
        moveY = moveY + forwardY
    end
    if love.keyboard.isDown("s") then
        moveX = moveX - forwardX
        moveY = moveY - forwardY
    end
    if love.keyboard.isDown("a") then
        moveX = moveX - strafeX
        moveY = moveY - strafeY
    end
    if love.keyboard.isDown("d") then
        moveX = moveX + strafeX
        moveY = moveY + strafeY
    end

    local mag = math.sqrt(moveX^2 + moveY^2)
    if mag > 0 then
        moveX = moveX / mag
        moveY = moveY / mag
    end

    local speed = player.moveSpeed * dt
    local newX = player.x + moveX * speed
    local newY = player.y + moveY * speed

    if not isWall(newX, player.y) then
        player.x = newX
    end
    if not isWall(player.x, newY) then
        player.y = newY
    end
end

-- Helper for game.lua to check if user pressed W/A/S/D in the current frame
function wasMovementKeyPressed()
    -- If any of these are being held, we consider that as "pressed"
    -- (i.e. "the user is trying to move")
    return love.keyboard.isDown("w") 
        or love.keyboard.isDown("a") 
        or love.keyboard.isDown("s") 
        or love.keyboard.isDown("d")
end
