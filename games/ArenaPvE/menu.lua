-- menu.lua
local Menu = {}
Menu.__index = Menu

function Menu:new()
    local self = setmetatable({}, Menu)
    self.fontTitle = love.graphics.newFont(40)
    self.fontSubtitle = love.graphics.newFont(20)
    return self
end

function Menu:draw()
    love.graphics.setColor(1, 1, 1, 1)
    love.graphics.setFont(self.fontTitle)
    love.graphics.printf("Hero vs Zombies", 0, love.graphics.getHeight() / 2 - 60, love.graphics.getWidth(), "center")
    
    love.graphics.setFont(self.fontSubtitle)
    love.graphics.printf("Press 'Enter' to Start", 0, love.graphics.getHeight() / 2, love.graphics.getWidth(), "center")
    love.graphics.printf("Press 'Escape' to Quit", 0, love.graphics.getHeight() / 2 + 30, love.graphics.getWidth(), "center")
end

function Menu:keypressed(key)
    if key == "return" then
        return "PLAYING"
    elseif key == "escape" then
        love.event.quit()
    end
    return nil
end

return Menu
