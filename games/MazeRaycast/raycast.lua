-- raycast.lua
-- Responsible for rendering the 3D view using raycasting

function drawScene()
    -- Draw sky (upper half) + floor (lower half)
    local skyColor   = {35/255, 5/255, 4/255}  -- deep dark blood (red)
    local floorColor = {21/255,21/255,21/255}  -- average color of the wall texture
    love.graphics.setColor(skyColor)
    love.graphics.rectangle("fill", 0, 0, screenWidth, screenHeight/2)
    love.graphics.setColor(floorColor)
    love.graphics.rectangle("fill", 0, screenHeight/2, screenWidth, screenHeight/2)

    -- Raycast each vertical column
    for screenX = 0, screenWidth - 1 do
        local cameraX = 2 * screenX / screenWidth - 1  -- range [-1, 1]
        local rayAngle = player.angle + cameraX * (player.fov / 2)

        local rayDirX = math.cos(rayAngle)
        local rayDirY = math.sin(rayAngle)

        local mapX = math.floor(player.x)
        local mapY = math.floor(player.y)

        local deltaDistX = (rayDirX == 0) and 1e30 or math.abs(1 / rayDirX)
        local deltaDistY = (rayDirY == 0) and 1e30 or math.abs(1 / rayDirY)

        local stepX, sideDistX
        if rayDirX < 0 then
            stepX = -1
            sideDistX = (player.x - mapX) * deltaDistX
        else
            stepX = 1
            sideDistX = (mapX + 1.0 - player.x) * deltaDistX
        end

        local stepY, sideDistY
        if rayDirY < 0 then
            stepY = -1
            sideDistY = (player.y - mapY) * deltaDistY
        else
            stepY = 1
            sideDistY = (mapY + 1.0 - player.y) * deltaDistY
        end

        local hit = false
        local side = 0
        while not hit do
            if sideDistX < sideDistY then
                sideDistX = sideDistX + deltaDistX
                mapX = mapX + stepX
                side = 0
            else
                sideDistY = sideDistY + deltaDistY
                mapY = mapY + stepY
                side = 1
            end

            if mapX < 0 or mapX >= mapWidth or mapY < 0 or mapY >= mapHeight then
                break
            end
            if worldMap[mapY+1][mapX+1] == 1 then
                hit = true
            end
        end

        local perpWallDist
        if side == 0 then
            perpWallDist = (sideDistX - deltaDistX)
        else
            perpWallDist = (sideDistY - deltaDistY)
        end

        if hit then
            local lineHeight = math.floor(screenHeight / perpWallDist)
            local drawStart = math.floor(-lineHeight / 2 + screenHeight / 2)
            local drawEnd   = drawStart + lineHeight
            if drawStart < 0 then drawStart = 0 end
            if drawEnd > screenHeight then drawEnd = screenHeight end

            -- Texture coordinates
            local wallX
            if side == 0 then
                wallX = player.y + perpWallDist * rayDirY
            else
                wallX = player.x + perpWallDist * rayDirX
            end
            wallX = wallX - math.floor(wallX)

            local texWidth  = wallTexture:getWidth()
            local texHeight = wallTexture:getHeight()
            local texX = math.floor(wallX * texWidth)
            if (side == 0 and rayDirX > 0) or (side == 1 and rayDirY < 0) then
                texX = texWidth - texX - 1
            end

            -- Fake shading if it's a Y-side
            if side == 1 then
                love.graphics.setColor(0.7, 0.7, 0.7)
            else
                love.graphics.setColor(1, 1, 1)
            end

            local columnQuad = love.graphics.newQuad(
                texX, 0,
                1, texHeight,
                texWidth, texHeight
            )

            local columnHeightScale = lineHeight / texHeight
            love.graphics.draw(
                wallTexture,
                columnQuad,
                screenX,
                drawStart,
                0,
                1,
                columnHeightScale
            )
        end
    end
end
