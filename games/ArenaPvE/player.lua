-- player.lua
Player = {}
Player.__index = Player

function Player:new()
    local self = setmetatable({}, Player)
    self.image = love.graphics.newImage("assets/images/player.png")
    self.x = love.graphics.getWidth() / 2
    self.y = love.graphics.getHeight() / 2
    self.speed = 200
    self.radius = math.max(self.image:getWidth(), self.image:getHeight()) / 2
    self.health = 100  -- Initialize health
    return self
end

function Player:update(dt)
    if love.keyboard.isDown("w") then
        self.y = self.y - self.speed * dt
    end
    if love.keyboard.isDown("s") then
        self.y = self.y + self.speed * dt
    end
    if love.keyboard.isDown("a") then
        self.x = self.x - self.speed * dt
    end
    if love.keyboard.isDown("d") then
        self.x = self.x + self.speed * dt
    end
    
    -- Clamp player position to window bounds
    self.x = math.max(self.radius, math.min(love.graphics.getWidth() - self.radius, self.x))
    self.y = math.max(self.radius, math.min(love.graphics.getHeight() - self.radius, self.y))
end

function Player:draw()
    local angle = math.atan2(love.mouse.getY() - self.y, love.mouse.getX() - self.x)
    love.graphics.draw(self.image, self.x, self.y, angle, 1, 1,
        self.image:getWidth() / 2, self.image:getHeight() / 2)
end

return Player
