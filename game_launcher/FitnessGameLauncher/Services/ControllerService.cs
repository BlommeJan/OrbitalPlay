using System;
using System.Threading.Tasks;

namespace FitnessGameLauncher.Services
{
    /// <summary>
    /// Provides methods to interact with the ball controller.
    /// </summary>
    public class ControllerService
    {
        /// <summary>
        /// Event that is raised when the controller status changes.
        /// </summary>
        public event EventHandler<ControllerStatusEventArgs> ControllerStatusChanged;

        /// <summary>
        /// Starts monitoring the controller's status.
        /// </summary>
        public void StartMonitoring()
        {
            // TODO: ↓
            // Implement logic to start monitoring the controller.
            // This could involve setting up event handlers or polling the device.
        }

        /// <summary>
        /// Stops monitoring the controller's status.
        /// </summary>
        public void StopMonitoring()
        {
            // TODO: ↓
            // Implement logic to stop monitoring the controller.
        }

        /// <summary>
        /// Simulates checking the controller's status.
        /// </summary>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task CheckControllerStatusAsync()
        {
            // Simulate a delay for asynchronous operation
            await Task.Delay(1000);

            // Simulate controller status
            var isConnected = true; // Replace with actual detection logic

            // Raise the event to notify subscribers
            ControllerStatusChanged?.Invoke(this, new ControllerStatusEventArgs(isConnected));
        }
    }

    /// <summary>
    /// Provides data for the ControllerStatusChanged event.
    /// </summary>
    public class ControllerStatusEventArgs : EventArgs
    {
        /// <summary>
        /// Gets a value indicating whether the controller is connected.
        /// </summary>
        public bool IsConnected { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ControllerStatusEventArgs"/> class.
        /// </summary>
        /// <param name="isConnected">Indicates if the controller is connected.</param>
        public ControllerStatusEventArgs(bool isConnected)
        {
            IsConnected = isConnected;
        }
    }
}
