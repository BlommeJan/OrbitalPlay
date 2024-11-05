using System.Collections.ObjectModel;
using System.IO;
using Newtonsoft.Json;
using FitnessGameLauncher.Models;

namespace FitnessGameLauncher.Services
{
    /// <summary>
    /// Provides methods to load and save game data.
    /// </summary>
    public class GameService
    {
        private readonly string _filePath;

        /// <summary>
        /// Initializes a new instance of the <see cref="GameService"/> class.
        /// </summary>
        /// <param name="filePath">The path to the games JSON file.</param>
        public GameService(string filePath = "Data/games.json")
        {
            _filePath = filePath;
        }

        /// <summary>
        /// Loads the list of games from the JSON file.
        /// </summary>
        /// <returns>An observable collection of games.</returns>
        public ObservableCollection<Game> LoadGames()
        {
            if (File.Exists(_filePath))
            {
                var json = File.ReadAllText(_filePath);
                var games = JsonConvert.DeserializeObject<ObservableCollection<Game>>(json);
                return games ?? new ObservableCollection<Game>();
            }
            else
            {
                // If the file doesn't exist, create an empty collection.
                return new ObservableCollection<Game>();
            }
        }

        /// <summary>
        /// Saves the list of games to the JSON file.
        /// </summary>
        /// <param name="games">The collection of games to save.</param>
        public void SaveGames(ObservableCollection<Game> games)
        {
            var json = JsonConvert.SerializeObject(games, Formatting.Indented);
            File.WriteAllText(_filePath, json);
        }
    }
}
