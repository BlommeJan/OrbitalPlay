/**
 * puzzle.js
 * Just a "Coming Soon" placeholder
 */

function initPuzzle() {
    document.getElementById('js-gameContainer').innerHTML = `
      <div style="text-align:center; color:#fff;">
        <h2>Puzzle (Work in Progress)</h2>
        <p>Coming Soon! Stay tuned for an exciting puzzle challenge!</p>
        <button onclick="returnToMainMenuPuzzle()">Go Back</button>
      </div>
    `;
  }
  
  function returnToMainMenuPuzzle() {
    document.getElementById('js-gameContainer').innerHTML = '';
    document.getElementById('js-selectedGameTitle').textContent = 'Select a game to start!';
    currentGame = null;
  }
  