using System.Windows;

namespace FitnessGameLauncher.Views
{
    /// <summary>
    /// Interaction logic for OverlayWindow.xaml
    /// </summary>
    public partial class OverlayWindow : Window
    {
        public OverlayWindow()
        {
            InitializeComponent();

            // Set the window's opacity and position based on user settings
            var settingsService = new Services.SettingsService();
            var userSettings = settingsService.LoadSettings();

            this.Opacity = userSettings.OverlayOpacity;
            this.Left = userSettings.OverlayPosition.X;
            this.Top = userSettings.OverlayPosition.Y;
        }
    }
}
