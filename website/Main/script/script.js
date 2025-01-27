/**
 * script.js
 * Central logic
 */

// Check if we've shown the video before
function showVideoOverlay() {
	if (!localStorage.getItem('hasSeenVideo')) {
		document.getElementById('js-videoOverlay').style.display = 'flex';
	}
}

function closeVideoOverlay() {
	document.getElementById('js-videoOverlay').style.display = 'none';
	localStorage.setItem('hasSeenVideo', 'true');
}

// Show video overlay when page loads
window.addEventListener('load', showVideoOverlay);

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
	// Store the selected theme in localStorage so the game page can access it
	localStorage.setItem('selectedTheme', theme);

	// Redirect to the appropriate game page
	if (gameId === 'targetShooter') {
		window.location.href = 'target-shooter.html';
	} else if (gameId === 'villainAttack') {
		window.location.href = 'villain-attack.html';
	}
}
