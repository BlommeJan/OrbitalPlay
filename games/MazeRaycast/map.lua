-- map.lua
-- Contains the maze layout, plus functions like isWall()

-- Maze layout:
--    0 = empty
--    1 = wall
--    2 = exit tile
-- We'll create a bigger "maze" style map; adjust to your liking.
worldMap = {
    {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1},
    {1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,1},
    {1,1,1,1,0,1,0,1,1,1,0,1,0,0,1,0,0,1,0,1},
    {1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1},
    {1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1},
    {1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1},
    {1,0,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1},
    {1,0,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1},
    {1,0,1,1,0,1,0,1,1,1,1,1,0,0,0,1,0,1,0,1},
    {1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1},
    {1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1},
    {1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1},
    {1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1},
    {1,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1},
    {1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1},
    {1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1},
    {1,0,1,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1},
    {1,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1},
    {1,0,0,0,0,1,0,0,0,2,0,1,0,0,0,1,0,0,0,1}, -- exit tile = 2
    {1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1},
}
mapWidth = #worldMap[1]
mapHeight = #worldMap

-- For collision detection (wall check)
function isWall(x, y)
    local tx = math.floor(x)
    local ty = math.floor(y)

    -- Out of bounds = treat as wall
    if tx < 0 or tx >= mapWidth or ty < 0 or ty >= mapHeight then
        return true
    end

    return (worldMap[ty+1][tx+1] == 1)
end

-- For checking if we've reached the exit
function isExit(x, y)
    local tx = math.floor(x)
    local ty = math.floor(y)
    if tx < 0 or tx >= mapWidth or ty < 0 or ty >= mapHeight then
        return false
    end
    return (worldMap[ty+1][tx+1] == 2)
end
