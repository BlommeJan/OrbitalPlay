-- bullet.lua
Bullet = {}
Bullet.__index = Bullet

function Bullet:new(x, y, targetX, targetY)
    local self = setmetatable({}, Bullet)
    self.image = love.graphics.newImage("assets/images/bullet.png")
    self.x = x
    self.y = y
    self.speed = 500
    local dx = targetX - x
    local dy = targetY - y
    local distance = math.sqrt(dx^2 + dy^2)
    self.velocityX = (dx / distance) * self.speed
    self.velocityY = (dy / distance) * self.speed
    self.radius = math.max(self.image:getWidth(), self.image:getHeight()) / 2
    self.angle = math.atan2(self.velocityY, self.velocityX) + math.pi / 2  -- Adjust for sprite orientation
    return self
end

function Bullet:update(dt)
    self.x = self.x + self.velocityX * dt
    self.y = self.y + self.velocityY * dt
end

function Bullet:draw()
    love.graphics.draw(self.image, self.x, self.y, self.angle, 1, 1,
        self.image:getWidth() / 2, self.image:getHeight() / 2)
end

return Bullet
