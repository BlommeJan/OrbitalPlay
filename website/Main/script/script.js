/**
 * script.js
 * Central logic for opening/closing the dialog and selecting which game to load
 */

let currentGame = null;

const gameDialog       = document.getElementById('js-gameDialog');
const gameContainer    = document.getElementById('js-gameContainer');
const selectedGameTitle= document.getElementById('js-selectedGameTitle');

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

  let gameId;
  switch (gameName) {
    case 'Target Shooter':
      gameId = 'targetShooter';
      break;
    case 'Zombie vs Hero':
      gameId = 'zombieVsHero';
      break;
    case 'Puzzle':
      gameId = 'puzzle';
      break;
    default:
      gameId = 'comingSoon';
      break;
  }

  currentGame = gameId;

  // Clear container
  gameContainer.innerHTML = '';

  if (gameId === 'comingSoon') {
    selectedGameTitle.textContent = 'Coming Soon!';
    gameContainer.innerHTML = `
      <div style="text-align:center;">
        <h2>Game Under Construction</h2>
        <p>Stay tuned for more adventures!</p>
      </div>
    `;
    closeGameDialog();
    return;
  }

  selectedGameTitle.textContent = gameName;
  closeGameDialog();

  switch (gameId) {
    case 'targetShooter':
      initTargetShooter();
      break;
    case 'zombieVsHero':
      initZombieVsHero();
      break;
    case 'puzzle':
      initPuzzle();
      break;
  }
}
