/**
 * villainattack.js
 */

function initZombieVsHero() {
    const html = `
      <div style="position:relative; width:100%; height:100%;">
        <canvas id="zvh-canvas" style="width:100%; height:100%;"></canvas>
  
        <div class="c-game-hud" id="zvh-hud">
          <div id="zvh-hpDisplay">HP: 100</div>
          <div id="zvh-waveDisplay">Wave: 1</div>
          <div id="zvh-scoreDisplay">Score: 0</div>
        </div>
  
        <div class="c-pause-overlay" id="zvh-pauseOverlay">
          <div class="c-pause-menu">
            <h3>Paused</h3>
            <button onclick="zvhResumeGame()">Resume</button>
            <button onclick="zvhReturnToMainMenu()">Main Menu</button>
          </div>
        </div>
  
        <div class="c-game-start-menu" id="zvh-startMenu">
          <div class="c-game-start-menu__box">
            <h2 style="color:#ff0;">Zombie vs Hero</h2>
            <p>Choose Theme:</p>
            <select id="zvh-themeSelect">
              <option value="candy">Candy</option>
              <option value="fantasy">Fantasy</option>
              <option value="hero">Hero</option>
              <option value="jungle">Jungle</option>
              <option value="space">Space</option>
            </select>
            <br/>
            <button onclick="zvhStartGame()">Start Game</button>
            <button onclick="zvhReturnToMainMenu()">Go Back</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('js-gameContainer').innerHTML = html;
  
    document.getElementById('zvh-startMenu').style.display = 'flex';
    document.getElementById('zvh-hud').style.display       = 'none';
  
    document.addEventListener('keydown', zvhOnKeyDown);
  }
  
  /* Game State */
  let zvhCanvas, zvhCtx;
  let zvhWidth, zvhHeight;
  let zvhIsPlaying = false;
  let zvhIsPaused  = false;
  let zvhPlayerHP  = 100;
  let zvhWave      = 1;
  let zvhScore     = 0;
  
  let zvhSpawnTimer = 0;
  let zvhBaseSpawnInterval = 2;
  let zvhMinSpawnInterval  = 0.5;
  let zvhSpawnRateFactor   = 0.02; // more distinct wave jump
  let zvhNextWaveScore     = 10;
  
  let zvhTheme = 'candy';
  
  let zvhBgImg     = new Image();
  let zvhPlayerImg = new Image();
  let zvhZombieImg = new Image();
  let zvhBulletImg = new Image();
  
  let zvhPlayer = { x:0, y:0, radius:30 }; 
  const zvhPlayerSpeed = 200;  // movement
  
  let zvhZombies = [];  // {x,y, radius, angle}
  let zvhBullets = [];  // {x,y, radius, angle, vx, vy, spinAngle}
  
  let zvhMouseX = 0, zvhMouseY = 0;
  let zvhLastTime = 0;
  
  // Only spawn left(0), right(1), bottom(2)
  const ZOMBIE_SIDES = [0,1,2];
  
  /* Start */
  function zvhStartGame() {
    zvhTheme = document.getElementById('zvh-themeSelect').value;
    document.getElementById('zvh-startMenu').style.display = 'none';
    document.getElementById('zvh-hud').style.display       = 'block';
  
    zvhIsPlaying = true;
    zvhIsPaused  = false;
    zvhPlayerHP  = 100;
    zvhWave      = 1;
    zvhScore     = 0;
    zvhSpawnTimer= 0;
    zvhNextWaveScore = 10;
  
    zvhZombies = [];
    zvhBullets= [];
  
    zvhBgImg.src     = `assets/villainattack/bg_${zvhTheme}.png`;
    zvhPlayerImg.src = `assets/villainattack/h_${zvhTheme}.png`;
    zvhZombieImg.src = `assets/villainattack/z_${zvhTheme}.png`;
    zvhBulletImg.src = `assets/villainattack/p_${zvhTheme}.png`;
  
    zvhCanvas = document.getElementById('zvh-canvas');
    zvhCtx    = zvhCanvas.getContext('2d');
    zvhResizeCanvas();
  
    // center player
    zvhPlayer.x = zvhWidth/2;
    zvhPlayer.y = zvhHeight/2;
  
    zvhCanvas.addEventListener('mousemove', zvhOnMouseMove);
    zvhCanvas.addEventListener('mousedown', zvhOnMouseDown);
  
    zvhLastTime = 0;
    requestAnimationFrame(zvhGameLoop);
  }
  
  function zvhResizeCanvas() {
    zvhWidth  = zvhCanvas.offsetWidth;
    zvhHeight = zvhCanvas.offsetHeight;
    zvhCanvas.width  = zvhWidth;
    zvhCanvas.height = zvhHeight;
  }
  
  function zvhGameLoop(timestamp) {
    const dt = (timestamp - zvhLastTime)/1000;
    zvhLastTime = timestamp;
  
    if (zvhIsPlaying && !zvhIsPaused && zvhPlayerHP>0) {
      zvhUpdate(dt);
    }
    zvhDraw();
  
    if (zvhIsPlaying) {
      requestAnimationFrame(zvhGameLoop);
    }
  }
  
  function zvhUpdate(dt) {
    // WASD
    if (zvhKeys['w']) zvhPlayer.y -= zvhPlayerSpeed*dt;
    if (zvhKeys['s']) zvhPlayer.y += zvhPlayerSpeed*dt;
    if (zvhKeys['a']) zvhPlayer.x -= zvhPlayerSpeed*dt;
    if (zvhKeys['d']) zvhPlayer.x += zvhPlayerSpeed*dt;
  
    // clamp
    if (zvhPlayer.x < zvhPlayer.radius) zvhPlayer.x = zvhPlayer.radius;
    if (zvhPlayer.x > zvhWidth - zvhPlayer.radius) zvhPlayer.x = zvhWidth - zvhPlayer.radius;
    if (zvhPlayer.y < zvhPlayer.radius) zvhPlayer.y = zvhPlayer.radius;
    if (zvhPlayer.y > zvhHeight - zvhPlayer.radius) zvhPlayer.y = zvhHeight - zvhPlayer.radius;
  
    // Zombies
    for (let i = zvhZombies.length - 1; i >= 0; i--) {
      let z = zvhZombies[i];
      // Move toward player, slower (e.g. speed=80)
      const dx = zvhPlayer.x - z.x;
      const dy = zvhPlayer.y - z.y;
      const dist = Math.hypot(dx, dy);
      if (dist>0) {
        const speed = 80;
        z.x += (dx/dist)*speed*dt;
        z.y += (dy/dist)*speed*dt;
        z.angle = Math.atan2(dy, dx) + Math.PI/2;
      }
  
      // Check collision
      if (Math.hypot(z.x - zvhPlayer.x, z.y - zvhPlayer.y) < (z.radius+zvhPlayer.radius)) {
        zvhPlayerHP -= 100*dt;
        if (zvhPlayerHP<=0) zvhPlayerHP=0;
      }
    }
  
    // Bullets
    for (let i = zvhBullets.length - 1; i>=0; i--) {
      let b = zvhBullets[i];
      b.x += b.vx*dt;
      b.y += b.vy*dt;
      b.spinAngle += 10*dt;  // spin faster
      b.angle = b.spinAngle;
  
      // Out of bounds?
      if (b.x<0 || b.x>zvhWidth || b.y<0 || b.y>zvhHeight) {
        zvhBullets.splice(i,1);
        continue;
      }
      // Check collision with zombies
      for (let j=zvhZombies.length-1; j>=0; j--) {
        let z = zvhZombies[j];
        if (Math.hypot(b.x - z.x, b.y - z.y) < (b.radius+z.radius)) {
          // kill zombie
          zvhZombies.splice(j,1);
          // remove bullet
          zvhBullets.splice(i,1);
          zvhScore++;
          break;
        }
      }
    }
  
    // spawn
    zvhSpawnTimer += dt;
    const spawnInterval = zvhGetSpawnInterval();
    if (zvhSpawnTimer>=spawnInterval) {
      zvhSpawnTimer = 0;
      // spawn wave # of zombies
      for (let w=0; w<zvhWave; w++) {
        zvhZombies.push(zvhCreateZombie());
      }
    }
    // wave logic
    if (zvhScore>=zvhNextWaveScore) {
      zvhWave++;
      zvhNextWaveScore *= 2;
    }
  }
  
  function zvhDraw() {
    // bg
    zvhCtx.drawImage(zvhBgImg, 0,0, zvhWidth, zvhHeight);
  
    // player => rotate to mouse
    const angle = Math.atan2(zvhMouseY - zvhPlayer.y, zvhMouseX - zvhPlayer.x);
    zvhDrawRot(zvhPlayerImg, zvhPlayer.x, zvhPlayer.y, angle, 0.6);
  
    // zombies
    for (let z of zvhZombies) {
      zvhDrawRot(zvhZombieImg, z.x, z.y, z.angle, 0.5); // 0.5 scale
    }
  
    // bullets
    for (let b of zvhBullets) {
      zvhDrawRot(zvhBulletImg, b.x, b.y, b.angle, 0.3);
    }
  
    // HUD
    document.getElementById('zvh-hpDisplay').textContent    = `HP: ${Math.floor(zvhPlayerHP)}`;
    document.getElementById('zvh-waveDisplay').textContent  = `Wave: ${zvhWave}`;
    document.getElementById('zvh-scoreDisplay').textContent = `Score: ${zvhScore}`;
  
    // game over
    if (zvhPlayerHP<=0) {
      zvhCtx.fillStyle = 'rgba(0,0,0,0.5)';
      zvhCtx.fillRect(0,0,zvhWidth,zvhHeight);
      zvhCtx.fillStyle = '#fff';
      zvhCtx.font = '40px Arial';
      zvhCtx.textAlign = 'center';
      zvhCtx.fillText('GAME OVER', zvhWidth/2, zvhHeight/2 -20);
      zvhCtx.font = '24px Arial';
      zvhCtx.fillText(`Score: ${zvhScore}`, zvhWidth/2, zvhHeight/2 +20);
      zvhCtx.fillText(`Press 'R' to Restart or 'Escape' to Quit`,
        zvhWidth/2, zvhHeight/2 +50);
    }
  }
  
  function zvhCreateZombie() {
    // only from left(0), right(1), bottom(2)
    const side = ZOMBIE_SIDES[Math.floor(Math.random()*ZOMBIE_SIDES.length)];
    let zx=0, zy=0;
    switch(side) {
      case 0: // left
        zx = 0; 
        zy = Math.random()*zvhHeight;
        break;
      case 1: // right
        zx = zvhWidth; 
        zy = Math.random()*zvhHeight;
        break;
      default: // bottom
        zx = Math.random()*zvhWidth;
        zy = zvhHeight;
    }
    return { x:zx, y:zy, radius:25, angle:0 };
  }
  
  // bullet
  function zvhShoot(x,y, tx,ty) {
    const dx = tx-x, dy = ty-y;
    let dist = Math.hypot(dx,dy);
    if (dist<1) dist=1;
    const speed = 450;
    const vx = (dx/dist)*speed;
    const vy = (dy/dist)*speed;
  
    zvhBullets.push({
      x, y, vx, vy,
      radius: 10,
      spinAngle:0,
      angle:0,
    });
  }
  
  function zvhDrawRot(img, cx, cy, angle, scale=1) {
    zvhCtx.save();
    zvhCtx.translate(cx, cy);
    zvhCtx.rotate(angle);
    let w = img.width*scale;
    let h = img.height*scale;
    zvhCtx.drawImage(img, -w/2, -h/2, w, h);
    zvhCtx.restore();
  }
  
  function zvhGetSpawnInterval() {
    let interval = zvhBaseSpawnInterval - (zvhWave-1)*zvhSpawnRateFactor;
    if (interval<zvhMinSpawnInterval) interval = zvhMinSpawnInterval;
    return interval;
  }
  
  /* input */
  const zvhKeys = {};
  window.addEventListener('keydown', (e)=>{
    zvhKeys[e.key.toLowerCase()] = true;
  });
  window.addEventListener('keyup', (e)=>{
    zvhKeys[e.key.toLowerCase()] = false;
  });
  
  function zvhOnMouseMove(e) {
    const rect = zvhCanvas.getBoundingClientRect();
    zvhMouseX = e.clientX - rect.left;
    zvhMouseY = e.clientY - rect.top;
  }
  function zvhOnMouseDown(e) {
    if (!zvhIsPaused && zvhPlayerHP>0) {
      zvhShoot(zvhPlayer.x, zvhPlayer.y, zvhMouseX, zvhMouseY);
    }
  }
  
  function zvhOnKeyDown(e) {
    if (!zvhIsPlaying) return;
    if (e.key === 'Escape') {
      if (zvhPlayerHP<=0) {
        // game over => main menu
        zvhReturnToMainMenu();
      } else {
        zvhIsPaused = !zvhIsPaused;
        document.getElementById('zvh-pauseOverlay').style.display = zvhIsPaused ? 'flex' : 'none';
      }
    } else if (e.key.toLowerCase()==='r' && zvhPlayerHP<=0) {
      // restart
      zvhStartGame();
    }
  }
  
  function zvhResumeGame() {
    zvhIsPaused = false;
    document.getElementById('zvh-pauseOverlay').style.display = 'none';
  }
  
  function zvhReturnToMainMenu() {
    zvhIsPlaying = false;
    document.getElementById('js-gameContainer').innerHTML = '';
    document.getElementById('js-selectedGameTitle').textContent = 'Select a game to start!';
    currentGame = null;
  }
  