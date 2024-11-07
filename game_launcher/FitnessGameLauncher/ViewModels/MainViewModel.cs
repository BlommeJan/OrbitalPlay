using System.ComponentModel;
using FitnessGameLauncher.Models;
using FitnessGameLauncher.Services;

namespace FitnessGameLauncher.ViewModels
{
    /// <summary>
    /// MainViewModel coordinates the other ViewModels and handles application-wide properties.
    /// </summary>
    public class MainViewModel : INotifyPropertyChanged
    {
        // ViewModel instances
        public HomeViewModel HomeVM { get; }
        public EditViewModel EditVM { get; }
        public ControllerViewModel ControllerVM { get; }
        public SettingsViewModel SettingsVM { get; }

        // Event required by INotifyPropertyChanged
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Initializes a new instance of the <see cref="MainViewModel"/> class.
        /// </summary>
        public MainViewModel()
        {
            // Initialize services
            var gameService = new GameService();
            var settingsService = new SettingsService();

            // Load user settings
            var userSettings = settingsService.LoadSettings();

            // Initialize ViewModels
            HomeVM = new HomeViewModel(gameService);
            EditVM = new EditViewModel(gameService, HomeVM);
            ControllerVM = new ControllerViewModel();
            SettingsVM = new SettingsViewModel(settingsService, userSettings);

            // Subscribe to settings changes if needed
            SettingsVM.PropertyChanged += SettingsVM_PropertyChanged;
        }

        private void SettingsVM_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(SettingsViewModel.IsDarkMode))
            {
                // Handle theme changes if necessary
            }
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
