-- zombie.lua
Zombie = {}
Zombie.__index = Zombie

function Zombie:new()
    local self = setmetatable({}, Zombie)
    self.image = love.graphics.newImage("assets/images/zombie.png")
    -- Spawn at random position on the edge of the screen
    local side = math.random(1, 4)
    if side == 1 then  -- Top
        self.x = math.random(0, love.graphics.getWidth())
        self.y = 0
    elseif side == 2 then  -- Right
        self.x = love.graphics.getWidth()
        self.y = math.random(0, love.graphics.getHeight())
    elseif side == 3 then  -- Bottom
        self.x = math.random(0, love.graphics.getWidth())
        self.y = love.graphics.getHeight()
    else  -- Left
        self.x = 0
        self.y = math.random(0, love.graphics.getHeight())
    end
    self.speed = 100
    self.radius = math.max(self.image:getWidth(), self.image:getHeight()) / 2
    self.angle = 0  -- Initialize angle
    return self
end

function Zombie:update(dt, player)
    -- Calculate direction to player
    local dx = player.x - self.x
    local dy = player.y - self.y
    local distance = math.sqrt(dx^2 + dy^2)
    if distance > 0 then
        self.x = self.x + (dx / distance) * self.speed * dt
        self.y = self.y + (dy / distance) * self.speed * dt
        self.angle = math.atan2(dy, dx) + math.pi / 2  -- Adjust angle for sprite orientation
    end
end

function Zombie:draw()
    love.graphics.draw(self.image, self.x, self.y, self.angle, 1, 1, 
        self.image:getWidth() / 2, self.image:getHeight() / 2)
end

return Zombie
