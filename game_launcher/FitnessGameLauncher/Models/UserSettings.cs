using System;
using System.Windows;

namespace FitnessGameLauncher.Models
{
    /// <summary>
    /// Represents user settings and preferences.
    /// </summary>
    public class UserSettings
    {
        /// <summary>
        /// Gets or sets a value indicating whether dark mode is enabled.
        /// </summary>
        public bool IsDarkMode { get; set; }

        /// <summary>
        /// Gets or sets the opacity of the in-game overlay.
        /// </summary>
        public double OverlayOpacity { get; set; }

        /// <summary>
        /// Gets or sets the position of the in-game overlay.
        /// </summary>
        public Point OverlayPosition { get; set; }

        /// <summary>
        /// Gets or sets the global hotkey for toggling the overlay.
        /// </summary>
        public string OverlayHotkey { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="UserSettings"/> class with default values.
        /// </summary>
        public UserSettings()
        {
            // Set default values
            IsDarkMode = true;
            OverlayOpacity = 0.5;
            OverlayPosition = new Point(100, 100);
            OverlayHotkey = "Control+Shift+O";
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="UserSettings"/> class with specified properties.
        /// </summary>
        /// <param name="isDarkMode">Indicates if dark mode is enabled.</param>
        /// <param name="overlayOpacity">Opacity of the overlay.</param>
        /// <param name="overlayPosition">Position of the overlay.</param>
        /// <param name="overlayHotkey">Hotkey to toggle the overlay.</param>
        public UserSettings(bool isDarkMode, double overlayOpacity, Point overlayPosition, string overlayHotkey)
        {
            IsDarkMode = isDarkMode;
            OverlayOpacity = overlayOpacity;
            OverlayPosition = overlayPosition;
            OverlayHotkey = overlayHotkey;
        }
    }
}
