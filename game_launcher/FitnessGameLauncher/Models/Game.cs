using System;

namespace FitnessGameLauncher.Models
{
    /// <summary>
    /// Represents a game with its details.
    /// </summary>
    public class Game
    {
        /// <summary>
        /// Gets or sets the name of the game.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the file path to the game's executable.
        /// </summary>
        public string ExecutablePath { get; set; }

        /// <summary>
        /// Gets or sets the file path to the game's icon.
        /// </summary>
        public string IconPath { get; set; }

        /// <summary>
        /// Gets or sets the category of the game ("One-Ball" or "Two-Ball").
        /// </summary>
        public string Category { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Game"/> class.
        /// </summary>
        public Game()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Game"/> class with specified properties.
        /// </summary>
        /// <param name="name">Name of the game.</param>
        /// <param name="executablePath">Path to the executable file.</param>
        /// <param name="iconPath">Path to the icon file.</param>
        /// <param name="category">Category of the game.</param>
        public Game(string name, string executablePath, string iconPath, string category)
        {
            Name = name;
            ExecutablePath = executablePath;
            IconPath = iconPath;
            Category = category;
        }
    }
}
