-- conf.lua

function love.conf(t)
    t.window.title = "Target Shooting Game"        -- Window title
    t.window.width = 800                           -- Initial window width
    t.window.height = 600                          -- Initial window height
    t.window.resizable = true                      -- Allow the window to be resizable
    t.window.minwidth = 400                        -- Minimum window width
    t.window.minheight = 300                       -- Minimum window height
    t.version = "11.4"                             -- LOVE version (ensure compatibility)
    t.modules.audio = true                         -- Enable audio module
    t.modules.image = true                         -- Enable image module
    t.modules.graphics = true                      -- Enable graphics module
end
