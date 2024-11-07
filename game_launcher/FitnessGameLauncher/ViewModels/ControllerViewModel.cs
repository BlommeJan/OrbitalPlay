using System.ComponentModel;
using System.Windows.Threading;
using Gma.System.MouseKeyHook;

namespace FitnessGameLauncher.ViewModels
{
    /// <summary>
    /// ControllerViewModel monitors the controller input and updates the status.
    /// </summary>
    public class ControllerViewModel : INotifyPropertyChanged
    {
        private string _controllerStatus;
        public string ControllerStatus
        {
            get => _controllerStatus;
            set
            {
                _controllerStatus = value;
                OnPropertyChanged(nameof(ControllerStatus));
            }
        }

        private IKeyboardMouseEvents _globalHook;

        // Event required by INotifyPropertyChanged
        public event PropertyChangedEventHandler PropertyChanged;

        /// <summary>
        /// Initializes a new instance of the <see cref="ControllerViewModel"/> class.
        /// </summary>
        public ControllerViewModel()
        {
            StartMonitoring();
        }

        /// <summary>
        /// Starts monitoring mouse movements to simulate controller input.
        /// </summary>
        private void StartMonitoring()
        {
            _globalHook = Hook.GlobalEvents();
            _globalHook.MouseMoveExt += GlobalHook_MouseMoveExt;
        }

        private void GlobalHook_MouseMoveExt(object sender, MouseEventExtArgs e)
        {
            ControllerStatus = $"Controller Active - X: {e.X}, Y: {e.Y}";
        }

        /// <summary>
        /// Stops monitoring mouse movements.
        /// </summary>
        public void StopMonitoring()
        {
            if (_globalHook != null)
            {
                _globalHook.MouseMoveExt -= GlobalHook_MouseMoveExt;
                _globalHook.Dispose();
                _globalHook = null;
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
