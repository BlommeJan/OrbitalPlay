using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using Microsoft.Win32;
using FitnessGameLauncher.Helpers;
using FitnessGameLauncher.Models;
using FitnessGameLauncher.Services;

namespace FitnessGameLauncher.ViewModels
{
    /// <summary>
    /// EditViewModel handles adding, editing, and removing games with validation.
    /// </summary>
    public class EditViewModel : ValidationBase
    {
        private readonly GameService _gameService;
        private readonly HomeViewModel _homeViewModel;

        public ObservableCollection<string> Categories { get; }

        private Game _newGame;
        public Game NewGame
        {
            get => _newGame;
            set
            {
                if (_newGame != value)
                {
                    _newGame = value;
                    OnPropertyChanged(nameof(NewGame));
                }
            }
        }

        // Commands
        public ICommand AddGameCommand { get; }
        public ICommand BrowseExecutableCommand { get; }
        public ICommand BrowseIconCommand { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="EditViewModel"/> class.
        /// </summary>
        /// <param name="gameService">The game service to use for saving games.</param>
        /// <param name="homeViewModel">Reference to the HomeViewModel to refresh the games list.</param>
        public EditViewModel(GameService gameService, HomeViewModel homeViewModel)
        {
            _gameService = gameService;
            _homeViewModel = homeViewModel;

            Categories = new ObservableCollection<string> { "One-Ball", "Two-Ball" };
            NewGame = new Game();

            AddGameCommand = new RelayCommand(AddGame, CanAddGame);
            BrowseExecutableCommand = new RelayCommand(BrowseExecutable);
            BrowseIconCommand = new RelayCommand(BrowseIcon);
        }

        /// <summary>
        /// Adds the new game to the collection after validation.
        /// </summary>
        private void AddGame()
        {
            // Create a new Game instance to add to the list
            var gameToAdd = new Game
            {
                Name = NewGame.Name,
                ExecutablePath = NewGame.ExecutablePath,
                IconPath = NewGame.IconPath,
                Category = NewGame.Category
            };

            // Add the new game to the HomeViewModel's Games collection
            _homeViewModel.Games.Add(gameToAdd);

            // Save the updated games list to games.json
            _gameService.SaveGames(_homeViewModel.Games);

            // Reset the NewGame property to clear the form
            NewGame = new Game();

            // Notify that the NewGame property has changed
            OnPropertyChanged(nameof(NewGame));

            // Refresh the CanExecute state of the AddGameCommand
            (AddGameCommand as RelayCommand)?.RaiseCanExecuteChanged();
        }

        /// <summary>
        /// Determines whether the AddGameCommand can execute.
        /// </summary>
        /// <returns>True if the command can execute; otherwise, false.</returns>
        private bool CanAddGame()
        {
            // Validate the NewGame properties
            ValidateAllProperties();

            // The command can execute only if there are no validation errors
            return !HasErrors;
        }

        private void BrowseExecutable()
        {
            OpenFileDialog openFileDialog = new OpenFileDialog
            {
                Filter = "Executable Files (*.exe)|*.exe",
                Title = "Select Game Executable"
            };

            if (openFileDialog.ShowDialog() == true)
            {
                NewGame.ExecutablePath = openFileDialog.FileName;
                OnPropertyChanged(nameof(NewGame));
            }
        }

        private void BrowseIcon()
        {
            OpenFileDialog openFileDialog = new OpenFileDialog
            {
                Filter = "Image Files (*.png;*.jpg;*.jpeg)|*.png;*.jpg;*.jpeg",
                Title = "Select Game Icon"
            };

            if (openFileDialog.ShowDialog() == true)
            {
                NewGame.IconPath = openFileDialog.FileName;
                OnPropertyChanged(nameof(NewGame));
            }
        }

        /// <summary>
        /// Validates all properties of the NewGame object.
        /// </summary>
        private void ValidateAllProperties()
        {
            ValidateProperty(nameof(NewGame.Name));
            ValidateProperty(nameof(NewGame.ExecutablePath));
            ValidateProperty(nameof(NewGame.IconPath));
            ValidateProperty(nameof(NewGame.Category));
        }

        /// <summary>
        /// Overrides the ValidateProperty method to implement custom validation logic.
        /// </summary>
        /// <param name="propertyName">The name of the property to validate.</param>
        protected override void ValidateProperty(string propertyName)
        {
            switch (propertyName)
            {
                case nameof(NewGame.Name):
                    if (string.IsNullOrWhiteSpace(NewGame.Name))
                        AddError(nameof(NewGame.Name), "Game name cannot be empty.");
                    else
                        ClearErrors(nameof(NewGame.Name));
                    break;

                case nameof(NewGame.ExecutablePath):
                    if (string.IsNullOrWhiteSpace(NewGame.ExecutablePath))
                        AddError(nameof(NewGame.ExecutablePath), "Executable path cannot be empty.");
                    else if (!System.IO.File.Exists(NewGame.ExecutablePath))
                        AddError(nameof(NewGame.ExecutablePath), "Executable file does not exist.");
                    else
                        ClearErrors(nameof(NewGame.ExecutablePath));
                    break;

                case nameof(NewGame.IconPath):
                    if (!string.IsNullOrWhiteSpace(NewGame.IconPath) && !System.IO.File.Exists(NewGame.IconPath))
                        AddError(nameof(NewGame.IconPath), "Icon file does not exist.");
                    else
                        ClearErrors(nameof(NewGame.IconPath));
                    break;

                case nameof(NewGame.Category):
                    if (string.IsNullOrWhiteSpace(NewGame.Category))
                        AddError(nameof(NewGame.Category), "Category must be selected.");
                    else
                        ClearErrors(nameof(NewGame.Category));
                    break;
            }

            // After validation, update the CanExecute state of the AddGameCommand
            (AddGameCommand as RelayCommand)?.RaiseCanExecuteChanged();
        }
    }
}
