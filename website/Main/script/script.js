/**
 * script.js
 * Central logic
 */

let currentGame = null;

const gameDialog = document.getElementById('js-gameDialog');
const gameContainer = document.getElementById('js-gameContainer');
const selectedGameTitle = document.getElementById('js-selectedGameTitle');

function openGameDialog() {
	if (typeof gameDialog.showModal === 'function') {
		gameDialog.showModal();
	} else {
		gameDialog.setAttribute('open', true);
	}
}

function closeGameDialog() {
	gameDialog.close();
}

function selectGame(e) {
	const gameName = e.currentTarget.dataset.gamename;
	const gameSelection = document.querySelector('.c-game-selection');
	const themeSelection = document.querySelector('.c-theme-selection');

	// Hide game selection
	gameSelection.style.display = 'none';

	// Show theme selection
	themeSelection.style.display = 'flex';

	// Show appropriate theme cards
	const targetShooterThemes = document.getElementById('js-targetShooterThemes');
	const villainAttackThemes = document.getElementById('js-villainAttackThemes');

	if (gameName === 'Target Shooter') {
		targetShooterThemes.style.display = 'flex';
		villainAttackThemes.style.display = 'none';
	} else if (gameName === 'Villain Attack') {
		villainAttackThemes.style.display = 'flex';
		targetShooterThemes.style.display = 'none';
	}
}

function showGameSelection() {
	const gameSelection = document.querySelector('.c-game-selection');
	const themeSelection = document.querySelector('.c-theme-selection');
	const gameArea = document.getElementById('js-gameArea');

	// Show game selection
	gameSelection.style.display = 'flex';

	// Hide theme selection and game area
	themeSelection.style.display = 'none';
	gameArea.style.display = 'none';

	// Reset game title
	document.getElementById('js-selectedGameTitle').textContent =
		'Select a game to start!';
}

function startGame(gameId, theme) {
	const gameArea = document.getElementById('js-gameArea');
	const themeSelection = document.querySelector('.c-theme-selection');
	const gameContainer = document.getElementById('js-gameContainer');
	const selectedGameTitle = document.getElementById('js-selectedGameTitle');

	// Hide theme selection
	themeSelection.style.display = 'none';

	// Show game area
	gameArea.style.display = 'flex';

	// Clear container
	gameContainer.innerHTML = '';

	// Update title and start game
	selectedGameTitle.textContent =
		gameId === 'targetShooter' ? 'Target Shooter' : 'Villain Attack';

	if (gameId === 'targetShooter') {
		initTargetShooter(theme);
	} else if (gameId === 'villainAttack') {
		initZombieVsHero(theme);
	}
}
