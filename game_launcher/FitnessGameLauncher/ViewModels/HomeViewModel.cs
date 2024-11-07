using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Diagnostics;
using System.Windows.Input;
using FitnessGameLauncher.Helpers;
using FitnessGameLauncher.Models;
using FitnessGameLauncher.Services;

namespace FitnessGameLauncher.ViewModels
{
    /// <summary>
    /// HomeViewModel handles the display and launching of games.
    /// </summary>
    public class HomeViewModel : INotifyPropertyChanged
    {
        private readonly GameService _gameService;

        private ObservableCollection<Game> _games;
        public ObservableCollection<Game> Games
        {
            get => _games;
            set
            {
                _games = value;
                OnPropertyChanged(nameof(Games));
            }
        }

        public ICommand LaunchGameCommand { get; }

        // Event required by INotifyPropertyChanged
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Initializes a new instance of the <see cref="HomeViewModel"/> class.
        /// </summary>
        /// <param name="gameService">The game service to use for loading games.</param>
        public HomeViewModel(GameService gameService)
        {
            _gameService = gameService;
            Games = _gameService.LoadGames();

            LaunchGameCommand = new RelayCommand<Game>(LaunchGame);
        }

        /// <summary>
        /// Launches the specified game.
        /// </summary>
        /// <param name="game">The game to launch.</param>
        private void LaunchGame(Game game)
        {
            if (game != null && !string.IsNullOrEmpty(game.ExecutablePath))
            {
                if (System.IO.File.Exists(game.ExecutablePath))
                {
                    Process.Start(game.ExecutablePath);
                }
                else
                {
                    // Notify user that the executable was not found
                }
            }
        }

        /// <summary>
        /// Reloads the games from the data source.
        /// </summary>
        public void ReloadGames()
        {
            Games = _gameService.LoadGames();
        }

        /// <summary>
        /// Raises the PropertyChanged event.
        /// </summary>
        /// <param name="propertyName">Name of the property that changed.</param>
        protected void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
