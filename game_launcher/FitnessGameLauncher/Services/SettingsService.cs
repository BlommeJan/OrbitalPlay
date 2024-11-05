using System.IO;
using Newtonsoft.Json;
using FitnessGameLauncher.Models;

namespace FitnessGameLauncher.Services
{
    /// <summary>
    /// Provides methods to load and save user settings.
    /// </summary>
    public class SettingsService
    {
        private readonly string _filePath;

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsService"/> class.
        /// </summary>
        /// <param name="filePath">The path to the settings JSON file.</param>
        public SettingsService(string filePath = "Data/settings.json")
        {
            _filePath = filePath;
        }

        /// <summary>
        /// Loads the user settings from the JSON file.
        /// </summary>
        /// <returns>A <see cref="UserSettings"/> object with the user's settings.</returns>
        public UserSettings LoadSettings()
        {
            if (File.Exists(_filePath))
            {
                var json = File.ReadAllText(_filePath);
                var settings = JsonConvert.DeserializeObject<UserSettings>(json);
                return settings ?? new UserSettings();
            }
            else
            {
                // If the file doesn't exist, return default settings.
                return new UserSettings();
            }
        }

        /// <summary>
        /// Saves the user settings to the JSON file.
        /// </summary>
        /// <param name="settings">The <see cref="UserSettings"/> object to save.</param>
        public void SaveSettings(UserSettings settings)
        {
            var json = JsonConvert.SerializeObject(settings, Formatting.Indented);
            File.WriteAllText(_filePath, json);
        }
    }
}
