using System.ComponentModel;
using System.Windows.Input;
using FitnessGameLauncher.Helpers;
using FitnessGameLauncher.Models;
using FitnessGameLauncher.Services;

namespace FitnessGameLauncher.ViewModels
{
    /// <summary>
    /// SettingsViewModel manages user settings such as themes and overlay customization.
    /// </summary>
    public class SettingsViewModel : INotifyPropertyChanged
    {
        private readonly SettingsService _settingsService;
        private UserSettings _userSettings;

        public bool IsDarkMode
        {
            get => _userSettings.IsDarkMode;
            set
            {
                if (_userSettings.IsDarkMode != value)
                {
                    _userSettings.IsDarkMode = value;
                    OnPropertyChanged(nameof(IsDarkMode));
                    OnPropertyChanged(nameof(IsLightMode));
                }
            }
        }

        public bool IsLightMode
        {
            get => !_userSettings.IsDarkMode;
            set
            {
                if (_userSettings.IsDarkMode == value)
                {
                    _userSettings.IsDarkMode = !value;
                    OnPropertyChanged(nameof(IsLightMode));
                    OnPropertyChanged(nameof(IsDarkMode));
                }
            }
        }

        public double OverlayOpacity
        {
            get => _userSettings.OverlayOpacity;
            set
            {
                if (_userSettings.OverlayOpacity != value)
                {
                    _userSettings.OverlayOpacity = value;
                    OnPropertyChanged(nameof(OverlayOpacity));
                }
            }
        }

        public double OverlayPositionX
        {
            get => _userSettings.OverlayPosition.X;
            set
            {
                if (_userSettings.OverlayPosition.X != value)
                {
                    _userSettings.OverlayPosition = new System.Windows.Point(value, _userSettings.OverlayPosition.Y);
                    OnPropertyChanged(nameof(OverlayPositionX));
                }
            }
        }

        public double OverlayPositionY
        {
            get => _userSettings.OverlayPosition.Y;
            set
            {
                if (_userSettings.OverlayPosition.Y != value)
                {
                    _userSettings.OverlayPosition = new System.Windows.Point(_userSettings.OverlayPosition.X, value);
                    OnPropertyChanged(nameof(OverlayPositionY));
                }
            }
        }

        public string OverlayHotkey
        {
            get => _userSettings.OverlayHotkey;
            set
            {
                if (_userSettings.OverlayHotkey != value)
                {
                    _userSettings.OverlayHotkey = value;
                    OnPropertyChanged(nameof(OverlayHotkey));
                }
            }
        }

        public ICommand SaveSettingsCommand { get; }

        // Event required by INotifyPropertyChanged
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Initializes a new instance of the <see cref="SettingsViewModel"/> class.
        /// </summary>
        /// <param name="settingsService">The settings service to use for loading and saving settings.</param>
        /// <param name="userSettings">The current user settings.</param>
        public SettingsViewModel(SettingsService settingsService, UserSettings userSettings)
        {
            _settingsService = settingsService;
            _userSettings = userSettings;

            SaveSettingsCommand = new RelayCommand(SaveSettings);
        }

        private void SaveSettings()
        {
            _settingsService.SaveSettings(_userSettings);
            // Notify application to update theme if necessary
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
