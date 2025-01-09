/**
 * Opens the dialog from the bottom.
 */
function openGameDialog() {
    const gameDialog = document.getElementById('js-gameDialog');
    if (typeof gameDialog.showModal === 'function') {
      gameDialog.showModal();
    } else {
      // Fallback if .showModal is not supported
      gameDialog.setAttribute('open', 'true');
    }
  }
  
  /**
   * Closes the dialog (close button inside the dialog).
   */
  function closeGameDialog() {
    const gameDialog = document.getElementById('js-gameDialog');
    gameDialog.close();
  }
  
  /**
   * When a user clicks a game card in the dialog:
   *  - Update the big area text
   *  - Close the dialog (optional)
   */
  function selectGame(event) {
    const gameName = event.currentTarget.dataset.gamename;
    const selectedGameTitle = document.getElementById('js-selectedGameTitle');
    
    // Update the text in the main rectangle
    selectedGameTitle.textContent = gameName;
  
    // Close the dialog
    closeGameDialog();
  }
  