/**
 * targetshooter.js
 */

function initTargetShooter() {
	const html = `
      <div style="position:relative; width:100%; height:100%;">
        <canvas id="ts-canvas" style="width:100%; height:100%;"></canvas>
  
        <div class="c-game-hud" id="ts-hud">
          <div id="ts-scoreDisplay">Score: 0</div>
          <div id="ts-timeDisplay">Time: 15</div>
        </div>
  
        <div class="c-pause-overlay" id="ts-pauseOverlay">
          <div class="c-pause-menu">
            <h3>Game Paused</h3>
            <button onclick="tsResumeGame()">Resume</button>
            <button onclick="tsReturnToMainMenu()">Main Menu</button>
          </div>
        </div>
  
        <div class="c-game-start-menu" id="ts-startMenu">
          <div class="c-game-start-menu__box">
            <h2 style="color:#ff0;">Target Shooter</h2>
            <p>Choose Theme:</p>
            <select id="ts-themeSelect">
              <option value="circus">Circus</option>
              <option value="cowboy">Cowboy</option>
              <option value="cyber">Cyber</option>
              <option value="space">Space</option>
              <option value="zombie">Zombie</option>
            </select>
            <br/>
            <button onclick="tsStartGame()">Start Game</button>
            <button onclick="tsReturnToMainMenu()">Go Back</button>
          </div>
        </div>
      </div>
    `;
	document.getElementById('js-gameContainer').innerHTML = html;

	document.getElementById('ts-startMenu').style.display = 'flex';
	document.getElementById('ts-hud').style.display = 'none';

	document.addEventListener('keydown', tsOnKeyDown);
}

/* Game state */
let tsCanvas, tsCtx;
let tsWidth, tsHeight;
let tsIsPlaying = false;
let tsIsPaused = false;
let tsGameOver = false;
let tsScore = 0;
let tsTime = 30;
let tsSpawnTimer = 0;
const tsSpawnInterval = 1.2; // spawn every 1.2s
let tsTheme = 'circus';

let tsBgImage = new Image();
let tsGoodTargetImg = new Image();
let tsBadTargetImg = new Image();
const tsHitSound = new Audio('assets/targetshooter/hit.wav');
const tsGameOverSound = new Audio('assets/targetshooter/gameover.wav');

let tsTargets = []; // {x, y, r, isGood}
let tsLastTime = 0;

/* Start */
function tsStartGame() {
	tsTheme = document.getElementById('ts-themeSelect').value;

	document.getElementById('ts-startMenu').style.display = 'none';
	document.getElementById('ts-hud').style.display = 'block';

	tsIsPlaying = true;
	tsIsPaused = false;
	tsGameOver = false;
	tsScore = 0;
	tsTime = 30;
	tsSpawnTimer = 0;
	tsTargets = [];

	// Load images
	tsBgImage.src = `assets/targetshooter/bg_${tsTheme}.png`;
	tsGoodTargetImg.src = `assets/targetshooter/gt_${tsTheme}.png`;
	tsBadTargetImg.src = `assets/targetshooter/bt_${tsTheme}.png`;
	tsCursorUrl = `assets/targetshooter/cursor_${tsTheme}.png`;

	// Setup canvas
	tsCanvas = document.getElementById('ts-canvas');
	tsCtx = tsCanvas.getContext('2d');
	tsResizeCanvas();

	// Set theme cursor
	tsCanvas.style.cursor = `url('${tsCursorUrl}'), auto`;

	// Event
	tsCanvas.addEventListener('mousedown', tsOnMouseDown);

	tsLastTime = 0;
	requestAnimationFrame(tsGameLoop);
}

function tsResizeCanvas() {
	tsWidth = tsCanvas.offsetWidth;
	tsHeight = tsCanvas.offsetHeight;
	tsCanvas.width = tsWidth;
	tsCanvas.height = tsHeight;
}

function tsGameLoop(time) {
	const dt = (time - tsLastTime) / 1000;
	tsLastTime = time;

	if (tsIsPlaying && !tsIsPaused && !tsGameOver) {
		tsUpdate(dt);
	}
	tsDraw();

	if (tsIsPlaying) {
		requestAnimationFrame(tsGameLoop);
	}
}

function tsUpdate(dt) {
	// countdown
	tsTime -= dt;
	if (tsTime <= 0) {
		tsTime = 0;
		tsGameOver = true;
		tsGameOverSound.currentTime = 0;
		tsGameOverSound.play();
	}

	// spawn
	tsSpawnTimer += dt;
	if (tsSpawnTimer >= tsSpawnInterval) {
		tsSpawnTimer = 0;
		tsSpawnTarget();
	}
}

function tsSpawnTarget() {
	const isGood = Math.random() < 0.5;
	const r = 40 + Math.random() * 30; // 40-70
	const x = r + Math.random() * (tsWidth - 2 * r);
	const y = r + Math.random() * (tsHeight - 2 * r);
	tsTargets.push({ x, y, r, isGood });
}

function tsDraw() {
	tsCtx.drawImage(tsBgImage, 0, 0, tsWidth, tsHeight);

	// draw targets
	for (let t of tsTargets) {
		if (t.isGood) {
			tsCtx.drawImage(tsGoodTargetImg, t.x - t.r, t.y - t.r, t.r * 2, t.r * 2);
		} else {
			tsCtx.drawImage(tsBadTargetImg, t.x - t.r, t.y - t.r, t.r * 2, t.r * 2);
		}
	}

	if (tsGameOver) {
		tsCtx.fillStyle = '#fff';
		tsCtx.font = '40px Arial';
		tsCtx.textAlign = 'center';
		tsCtx.fillText(
			`Game Over! Score: ${tsScore}`,
			tsWidth / 2,
			tsHeight / 2 - 40
		);
		tsDrawReplayButton();
	}

	// HUD
	document.getElementById('ts-scoreDisplay').textContent = `Score: ${tsScore}`;
	document.getElementById('ts-timeDisplay').textContent = `Time: ${Math.ceil(
		tsTime
	)}`;
}

function tsDrawReplayButton() {
	const w = 200,
		h = 60;
	const x = (tsWidth - w) / 2;
	const y = tsHeight / 2 + 20;
	tsCtx.fillStyle = '#800';
	tsCtx.fillRect(x, y, w, h);

	tsCtx.fillStyle = '#fff';
	tsCtx.font = '30px Arial';
	tsCtx.fillText('Replay', x + w / 2, y + 40);
}

function tsOnMouseDown(e) {
	if (tsGameOver) {
		// check replay
		const [mx, my] = tsGetMousePos(e);
		if (tsPointInReplay(mx, my)) {
			tsReplay();
		}
		return;
	}
	if (tsIsPaused) return;

	const [mx, my] = tsGetMousePos(e);
	// check if we hit a target
	for (let i = tsTargets.length - 1; i >= 0; i--) {
		let t = tsTargets[i];
		const dist = tsDistance(mx, my, t.x, t.y);
		if (dist < t.r) {
			// hit
			if (t.isGood) {
				tsScore++;
				tsTime += 2;
				tsHitSound.currentTime = 0;
				tsHitSound.play();
			} else {
				tsTime -= 5;
				if (tsTime < 0) tsTime = 0;
			}
			tsTargets.splice(i, 1);
			break;
		}
	}
}

function tsReplay() {
	tsGameOver = false;
	tsScore = 0;
	tsTime = 15;
	tsSpawnTimer = 0;
	tsTargets = [];
	tsGameOverSound.pause();
	tsGameOverSound.currentTime = 0;
}

function tsPointInReplay(mx, my) {
	const w = 200,
		h = 60;
	const x = (tsWidth - w) / 2;
	const y = tsHeight / 2 + 20;
	return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

function tsGetMousePos(e) {
	const rect = tsCanvas.getBoundingClientRect();
	return [e.clientX - rect.left, e.clientY - rect.top];
}

function tsDistance(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function tsOnKeyDown(e) {
	if (!tsIsPlaying) return;
	if (e.key === 'Escape' && !tsGameOver) {
		tsIsPaused = !tsIsPaused;
		const overlay = document.getElementById('ts-pauseOverlay');
		overlay.style.display = tsIsPaused ? 'flex' : 'none';
	}
}

function tsResumeGame() {
	tsIsPaused = false;
	document.getElementById('ts-pauseOverlay').style.display = 'none';
}

function tsReturnToMainMenu() {
	tsIsPlaying = false;
	document.getElementById('js-gameContainer').innerHTML = '';
	showGameSelection();
}
